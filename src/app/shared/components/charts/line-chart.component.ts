// Reusable line chart component. Display D3 line chart.
// Requires an input [lineData], which is the data to display

import {Component, Input, ViewChild, ElementRef} from '@angular/core';
import {CommonModule} from '@angular/common';
import * as d3 from 'd3';

export interface LineChartData {
  x: number;
  date: Date;
}

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #svg id="svg"></div>`,
  styles: [
    `
      #svg {
        text-align: center;
      }
    `
  ]
})
export class LineChartComponent {
  @ViewChild('svg') lineChart!: ElementRef;
  @Input() lineData: LineChartData[] = [];

  svg!: SVGSVGElement | null;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    if (this.lineData.length) {
      this.svg = SvgLineChart(this.lineData);
      console.log(this.lineData);
    }
  }

  ngAfterViewInit() {
    if (this.lineData.length) {
      const ele = this.lineChart.nativeElement;
      ele.appendChild(this.svg);
    }
  }
}

export const SvgLineChart = (data: LineChartData[]) => {
  // Declare the chart dimensions and margins.
  const width = 1200;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;

  // Declare the x (horizontal position) scale.
  const x = d3.scaleUtc(d3.extent(data, d => d.date) as Iterable<d3.NumberValue>, [marginLeft, width - marginRight]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear([4, d3.max(data, d => d.x)] as Iterable<d3.NumberValue>, [height - marginBottom, marginTop]);

  // Declare the line generator.
  const line = d3.line()
    .x((d: any) => x(d.date))
    .y((d: any) => y(d.x));

  // Create the SVG container.
  const svg = d3.create('svg')
    .attr('viewBox', [0, 0, width, height])
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic; font: 10px sans-serif;')
    .style('-webkit-tap-highlight-color', 'transparent')
  // .style("overflow", "visible")
  // .on("pointerenter pointermove", pointermoved)
  // .on("pointerleave", pointerleft)
  // .on("touchstart", event => event.preventDefault());

  // Add the x-axis.
  svg.append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  // Add the y-axis, remove the domain line, add grid lines and a label.
  svg.append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call(g => g.select('.domain').remove())
    .call(g => g.selectAll('.tick line').clone()
      .attr('x2', width - marginLeft - marginRight)
      .attr('stroke-opacity', 0.1))
    .call(g => g.append('text')
      .attr('x', -marginLeft)
      .attr('y', 10)
      .attr('fill', '#31c48e')
      .attr('text-anchor', 'start')
      .text('↑ Daily Close ($)'));

  // Append a path for the line.
  svg.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#31c48e')
    .attr('stroke-width', 1.5)
    .attr('d', line(data as any));

  // Create the tooltip container.
  const tooltip = svg.append('g');

  function formatValue(value: any) {
    return value.toLocaleString('en', {
      style: 'currency',
      currency: 'USD'
    });
  }

  function formatDate(date: any) {
    return date.toLocaleString('en', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }

  // Add the event listeners that show or hide the tooltip.
  const bisect = d3.bisector((d: any) => d.date).center;

  // TODO: try to implement pointer on the line. Don't have enough time.
  function pointermoved(event: any) {
    const i = bisect(data, x.invert(d3.pointer(event)[0]));
    tooltip.style('display', null);
    tooltip.attr('transform', `translate(${x(data[i].date)},${y(data[i].x)})`);

    const path = tooltip.selectAll('path')
      .data([,])
      .join('path')
      .attr('fill', 'white')
      .attr('stroke', 'black');

    const text = tooltip.selectAll('text')
      .data([,])
      .join('text')
      .call(text => text
        .selectAll('tspan')
        .data([formatDate(data[i].date), formatValue(data[i].x)])
        .join('tspan')
        .attr('x', 0)
        .attr('y', (_, i) => `${i * 1.1}em`)
        .attr('font-weight', (_, i) => i ? null : 'bold')
        .text(d => d));

    size(text, path);
  }

  // TODO: try to implement pointer on the line. Don't have enough time.
  function pointerleft() {
    tooltip.style('display', 'none');
  }

  // Wraps the text with a callout path of the correct size, as measured in the page.
  function size(text: any, path: any) {
    const {x, y, width: w, height: h} = text.node().getBBox();
    text.attr('transform', `translate(${-w / 2},${15 - y})`);
    path.attr('d', `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`);
  }

  return svg.node();
}
