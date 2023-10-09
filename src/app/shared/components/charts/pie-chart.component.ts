// Reusable pie chart component. Display D3 pie chart.
// Requires an input [pieData], which is the data to display

import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as d3 from 'd3';
import {Colors} from 'src/app/modules/items/item';
import {MatCardModule} from '@angular/material/card';

export interface Props {
  name: string;
  value: string;
  color?: string;
}

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <figure id="pie"></figure>`,
})
export class PieChartComponent {
  @Input() pieData!: Props[];
  width = 928;
  height = Math.min(this.width, 500);
  margin = 25;
  // The radius of the pie chart is half the smallest side
  private radius = Math.min(this.width, this.height) / 2 - this.margin;
  textColor = '#2B1A14';

  ngOnInit() {
    this.createSvg();
    this.createColors();
    this.drawChart();
  }


  svg!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;

  private createSvg(): void {
    this.svg = d3
      .select('figure#pie')
      .append('svg')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      // .attr('width', this.width)
      //.attr('height', this.height)
      .append('g')
      .attr(
        'transform',
        'translate(' + this.width / 2 + ',' + this.height / 2 + ')'
      );
  }

  colors!: d3.ScaleOrdinal<string, unknown, never>;

  private createColors(data = this.pieData): void {
    this.colors = d3
      .scaleOrdinal()
      .domain(data.map(d => d.value.toString()))
      .range(Colors);
  }

  private drawChart(data = this.pieData): void {
    // Compute the position of each group on the pie
    const pie = d3.pie<any>().value((d: any) => Number(d.value));
    const data_ready = pie(data);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    this.svg
      .selectAll('pieces')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', d3.arc().innerRadius(0).outerRadius(this.radius) as any)
      .attr('fill', (d, i) => (d.data.color ? d.data.color : this.colors(i.toString())))
      .attr('stroke', '#2B1A14')
      .style('stroke-width', '1px');
    // Now add the annotation. Use the centroid method to get the best coordinates
    const labelLocation = d3
      .arc()
      .innerRadius(50)
      .outerRadius(this.radius);
    this.svg
      .selectAll('pieces')
      .data(pie(data))
      .enter()
      .append('text')
      .text((d: any) => {
        if (((d.endAngle - d.startAngle) / (2 * Math.PI)) * 100 > 5) {
          return (d.data.value + '%');
        } else return d.data.name;
      })
      .attr('transform', (d: any) => 'translate(' + labelLocation.centroid(d) + ')')
      .style('text-anchor', 'middle')
      .style('font-size', 28)
      .attr('fill', this.textColor);
  }

}
