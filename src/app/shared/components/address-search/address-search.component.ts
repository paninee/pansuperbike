import {Component, Input, Output, EventEmitter} from '@angular/core';
import {
  FormControl, FormGroup,
  FormBuilder, Validators
} from '@angular/forms';
//mapbox
import {MapMouseEvent} from 'mapbox-gl';
//rxjs
import {debounceTime} from 'rxjs';
import {map} from 'rxjs/operators';
//services
import {MapboxService} from 'src/app/shared/services/mapbox/mapbox.service';
import {environment} from 'src/environments/environment';

@Component({
  selector: 'app-address-search',
  templateUrl: './address-search.component.html',
  styleUrls: ['./address-search.component.scss']
})
export class AddressSearchComponent {
  @Output() groupFormEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input() group: FormGroup = new FormGroup({});

  @Input() key: string = 'place_name';

  @Input() lang: string = 'en';

  @Input() itemLngLat: [number, number] | any;

  centreLatLng: [number, number] | any = environment.defaultLocation;

  accessToken: string = environment.mapBoxToken;

  input = new FormControl('');

  public markerLatLng!: [number, number] | null;
  public mapData: any;

  public list: any[] = [];

  public cursorIsIn!: boolean;

  constructor(
    private mapboxService: MapboxService,
    private fb: FormBuilder
  ) {
  }

  isBrowser = false;

  ngOnInit() {
    /*
    * by default,
    * set location coordinate to center the map
    */
    if (this.itemLngLat) {
      this.centreLatLng = this.itemLngLat
    }

    this.addFormControl(); // build address from
    this.listenInputChanges(); // listen for input changes, when searching
  }

  ngAfterViewInit() {
    // request current user location
    this.requestCurrentLocation();
  }

  get form(): any {
    return this.group.controls;
  }

  addFormControl() {
    // ------- [START] Build Address Angular reactive form
    const addressControl = this.fb.control(
      null, [Validators.required]
    );
    this.group.addControl('address', addressControl);

    const locationControl = this.fb.control(
      null, [Validators.required]
    );
    this.group.addControl('location', locationControl);
    // ------- [END] Build Address Angular reactive form

  }

  // request current user location
  async requestCurrentLocation() {
    const position: any = await this.mapboxService.getCurrentPosition();
    if (position && position.coords) {
      const userLocation: any = [position.coords.longitude, position.coords.latitude];
      this.mapboxService.setUserLocation(userLocation);
      this.centreLatLng = userLocation;
    }
  }

  // listen for input changes when searching for address
  listenInputChanges(): void {
    this.group.get('address')?.valueChanges
      .pipe(
        debounceTime(1000),
        map(query => query ? query.trim() : '')
      )
      .subscribe(value => {
        this.search(value);
      });
  }

  // search query and get addresses list
  search(query: string | null): void {
    if (!query) {
      this.list = [];
      return;
    }

    const filters = {Name: query};
    this.mapboxService.getAll(filters).subscribe({
      next: (res: any) => {
        if (res && !res.hasOwnProperty('error')) {
          if (res.items.length > 0) {
            this.list = res.items;
          } else {
            this.list = [{place_name: `No result`, isNoResult: true}];
          }
        } else {
          this.list = [];
        }
      },
      error: (error) => {
      }
    })
  }

  // on blur reset list
  onInputBlur(): void {
    if (!this.cursorIsIn) {
      this.list = [];
    }
  }

  // on clear search address, reset address input
  // and reset map
  onInputClear(): void {
    this.group.get('address')?.reset('', {emitEvent: false});
    this.list = [];
    this.resetMap();
  }

  // reset map
  resetMap(lngLat = null) {
    this.centreLatLng = lngLat || this.getLonLat() as [number, number];
    this.markerLatLng = null;
  }

  //once user click on one of the search result list
  // set address value, and marker
  onResultClick(item: any, input: any): void {
    if (!item.hasOwnProperty('isNoResult')) {
      input.value = item[this.key];
      this.list = [];
      this.address = item.place_name || '';
      this.setMarker(item.center[0], item.center[1]);
    }
  }

  // on map click event
  mapClicked(evt: MapMouseEvent) {
    if (evt.hasOwnProperty('lngLat')) {
      const {lat, lng} = evt.lngLat;
      this.setMarker(lng, lat);
    }
  }

  // set marker on map
  setMarker(lng: number, lat: number) {
    this.markerLatLng = null;
    this.centreLatLng = [lng, lat];

    // reverse geocoding by lng lat
    this.mapboxService.reverseGeocoding(lng, lat).subscribe({
      next: (res: any) => {
        this.mapData = res;
        this.processReverseGeocoding(lng, lat)
      },
      error: (error) => {
      }
    })
  }

  address: any = null;

  // process the result of reverse geocoding
  processReverseGeocoding(lng: number, lat: number) {
    const country = this.mapData.features.find((el: any) => el.place_type.includes('country'));
    if (!country) {
      this.mapData = null;
      this.address = null;
      this.group.get('address')?.setValue(null, {emitEvent: false});
      this.group.get('location')?.setValue(null, {emitEvent: false});
      this.group.updateValueAndValidity();
      this.centreLatLng = this.getLonLat() as [number, number];
      this.groupFormEvent.emit(this.group);
      return;
    }

    if (!this.mapData.features.length) {
      this.address = null;
      this.group.get('address')?.setValue(null, {emitEvent: false});
      this.group.get('location')?.setValue(null, {emitEvent: false});
      this.input?.setValue(this.address, {emitEvent: false})
    } else {
      this.address = this.mapData.features[0].place_name;
      this.group.get('address')?.setValue(this.address, {emitEvent: false});
      this.input?.setValue(this.address, {emitEvent: false})
    }

    this.group.get('location')?.setValue({latitude: lat, longitude: lng}, {emitEvent: false});
    this.group.updateValueAndValidity();
    this.groupFormEvent.emit(this.group);

    this.markerLatLng = [lng, lat];
    this.centreLatLng = [lng, lat];
  }

  onCursorIsInStatusChanges(status: any): void {
    this.cursorIsIn = status === 'mouseover';
  }

  getLonLat() {
    if (this.mapboxService.getUserLocation) {
      return this.mapboxService.getUserLocation;
    } else if (this.itemLngLat) {
      return this.itemLngLat;
    } else {
      return environment.defaultLocation;
    }
  }

}
