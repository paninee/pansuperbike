import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Map, LngLatLike, LngLat, LngLatBounds} from 'mapbox-gl';
import {Observable, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {
  accessToken = environment.mapBoxToken;
  defaultLocation = environment.defaultLocation
  mapEl!: Map;
  public userLocation!: LngLatLike;
  centerMapLngLat!: LngLat

  constructor(
    private http: HttpClient
  ) {
  }

  public get getUserLocation(): LngLatLike | null {
    return this.userLocation;
  }


  /*
   * request current position permissions
   */
  async getCurrentPosition() {
    if ('geolocation' in navigator) {
      return await this.processRequestLocation();
    } else {
      return null;
    }
  }

  // start timer to request location
  processRequestLocation() {
    try {
      return Promise.race([this.requestCurrentLocation(), this.timeout(5500)])
    } catch (error) {
      return null;
    }
  }

  // ask current location permission
  async requestCurrentLocation() {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(resolve, resolve, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 3000,
      });
    });
  }

  // timer of requesting location
  timeout(sec = 3) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({timeout: true})
      }, sec * 1000);
    });
  }

  // center the map
  centerMap(lngLat: LngLatLike): this {
    this.mapEl.setCenter(lngLat);
    return this;
  }

  // set map element
  setMapEl(mapEl: Map): this {
    this.mapEl = mapEl;
    return this;
  }

  // set user location
  setUserLocation(v: LngLatLike): this {
    this.userLocation = v;
    return this;
  }

  /*
  * check if coordinates exist and set user location
  * center map
  */
  processCurrentPositionResult(position: any): MapboxService {
    if (position && position.coords) {
      const userLocation = [position.coords.longitude, position.coords.latitude] as LngLatLike;
      this.setUserLocation(userLocation);
    }
    return this;
  }

  // get current location if exist
  // otherwise get default location
  getCurrentOrDefaultLocation() {
    if (this.getUserLocation) return this.userLocation;
    else return environment.defaultLocation;
  }

  // init bounds
  bounds = new LngLatBounds();

  setBounds(): MapboxService {
    this.bounds = new LngLatBounds();
    return this;
  }

  // extend bounds
  extendBounds(coordinate: any): MapboxService {
    this.bounds.extend(coordinate);
    return this;
  }

  // camera for bounds
  cameraForBounds() {
    const centerData = this.mapEl.cameraForBounds(this.bounds) as any;
    // Try to center the map so that all the markers show up
    this.mapEl.easeTo({...centerData, zoom: (centerData.zoom < 16 ? centerData.zoom : 16)});
  }

  // center bound location
  centerBoundLocationOnMap(coordinate: any) {
    this.centerMap(coordinate).setBounds().extendBounds(coordinate);
  }

  //get user location if exist
  // otherwise get lng lat of map's viewport
  getUserLocationOrMapCenter() {
    if (this.getUserLocation) return this.getUserLocation;
    else return this.getCenterMapLngLat();
  }

  // set lngLat of map's viewport
  setMapCenterLngLat(lngLat: LngLat): MapboxService {
    this.centerMapLngLat = lngLat;
    return this;
  }

  // get map's viewport lngLat
  getCenterMapLngLat() {
    return [this.centerMapLngLat.lng, this.centerMapLngLat.lat];
  }


  private mapboxEnpoint: string = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

  // converts location text into geographic coordinates
  getAll(query: any): Observable<any> {
    let jsonQuery = `${encodeURIComponent(query.Name)}.json`;
    let queryParams = `access_token=${this.accessToken}&country=ca,us&autocomplete=true&types=country%2Cregion%2Cneighborhood%2Caddress%2Cpoi&language=${this.lang}&limit=10`;
    return this.http.get<any>(`${this.mapboxEnpoint}/${jsonQuery}?${queryParams}`).pipe(
      map(response => {
        const items = response.features;
        return {items};
      })
    );
  }

  // Reverse Geocoding
  // look up a single pair of coordinates and returns the geographic feature
  reverseGeocoding(lng: number, lat: number): Observable<any> {
    let jsonQuery = `${lng},${lat}.json`;
    let queryParams = `access_token=${this.accessToken}&country=ca,us&language=${this.lang}`;
    return this.http.get<any>(`${this.mapboxEnpoint}/${jsonQuery}?${queryParams}`)
      .pipe(
        map(response => {
          return response
        })
      );
  }

  lang = 'en';

  setLang(val: string) {
    this.lang = val;
  }

}
