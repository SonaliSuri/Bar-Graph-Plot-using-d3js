/* ----------------------------------------------------------------------------
File: BarGraphSample.js
Constructs the Bar Graph using D3
80 characters per line, avoid tabs. Indent at 4 spaces. See google style guide on
JavaScript, if needed.
-----------------------------------------------------------------------------*/ 
// Search "D3 Margin Convention" on Google to understand margins.
// Add comments here in your own words to explain the margins below

/*--------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------------------------------------------------
1. The margin below specifies that there will be a border of 10 pixels at the top, 40 at the right and 150 and 50 at the bottom and left respectively.  Whenever we would like to access the margins , we can access it using  margin.top,margin.right,margin.bottom and margin.left respectively. The width is set to (760 - margin.left(here 50 px) - margin.right(here 40px)) and height is set to (500 - margin.top(here 10 px) - margin.bottom(150 px)). The padding is set to 0px and barpadding attribute is set to 1px.
-------------------------------------------------------------------------------------------------------------------------------------------------------
*/
var margin = {top: 10, right: 40, bottom: 150, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    
var padding = 0;
var barPadding = 1;
// Define SVG. "g" means group SVG elements together. 
// Add comments here in your own words to explain this segment of code
/*
-------------------------------------------------------------------------------------------------------------------------------------------------------
2. For coding in d3, it is important to select the elements before changing or modifying any elements. This can be done using either d3.select(this)  where “this” is the specific element(s) you are trying to select. In the below code, we are trying to select the element body for modifying it.
.append() takes the "body" element selection and adds a svg container. After adding the svg container, .append() completes by returning the current selection. The width is specified for the current selection that is the "svg container" which is set to width (defined above) + margin.left (defined under margins) + margin.right (defined under margins). Next, the height for svg container is set to height(defined above) + margin.top(defined under margins) + margin.bottom(defined under margins). Next, we append the "g" element to the SVG, which is used to group SVG shapes together. The transform attribute refers to the geometric kind here the translation (movement) where the translation moves all the points of an element in the same direction and by the same amount. Here the margin.left refers to x coordinate and margin.top refers to the y coordinate i.e. the horizontal and vertical pixels by which to translate the element.
-------------------------------------------------------------------------------------------------------------------------------------------------------
   
*/
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/* --------------------------------------------------------------------
SCALE and AXIS are two different methods of D3. See D3 API Reference and lookup SVG AXIS and SCALES. See D3 API Reference to understand the difference between the Ordinal vs. Linear scale.
----------------------------------------------------------------------*/ 

// Define X and Y SCALE.
// Add comments in your own words to explain the code below
/*
-------------------------------------------------------------------------------------------------------------------------------------------------------
3. d3.scaleBand() helps to construct a new band scale with the specified domain and range, with no padding and no rounding with center alignment as default. If the domain is not specified, it defaults it to the empty domain. If the range is not specified, the default range is [0, 1]. For xScale, rangeround sets the scale’s range to the specified two-element array of numbers i.e. [0, width] while also enabling rounding, which means that the start and stop of each band will be integers. Padding sets the inner and the outer padding to the value 0.1 (which is the padding between the bars as well as the padding at the beginning and the end).

d3.scaleLinear() helps to construct a new continuous scale with the specified domain and range. If either domain or range is not specified, each defaults to [0, 1]. The range helps to set the scale’s range to the specified array of values i.e. [height,0], which helps us to generate the bars in an expected manner. If we had used range[0, height] , the output of bars would have been an inverted one.
-------------------------------------------------------------------------------------------------------------------------------------------------------
*/
var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);

var yScale = d3.scaleLinear().range([height, 0]);

// Define X and Y AXIS
// Define tick marks on the y-axis as shown on the output with an interval of 5 and $ sign

/*
-------------------------------------------------------------------------------------------------------------------------------------------------------
6. The below code helps us to generate ticks at an interval of 5 using ticks(5) with a $ sign using .tickFormat(function(d) { return  "$"+d3.format(",")(d) }); 
-------------------------------------------------------------------------------------------------------------------------------------------------------
   
*/
var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft()
.scale(yScale)
.ticks(5)
.tickFormat(function(d) { return  "$"+d3.format(",")(d) });

/* --------------------------------------------------------------------
To understand how to import data. See D3 API refrence on CSV. Understand
the difference between .csv, .tsv and .json files. To import a .tsv or
.json file use d3.tsv() or d3.json(), respectively.
----------------------------------------------------------------------*/ 

// data.csv contains the country name(key) and its GDP(value)
// d.key and d.value are very important commands
// You must provide comments here to demonstrate your understanding of these commands
/*
-------------------------------------------------------------------------------------------------------------------------------------------------------
4.D3 provides built-in support for parsing comma-separated-values, tab-separated values, and arbitrary delimiter-separated values, which is using d3.csv("Filename"). In the below code for the file GDP2020TrillionUSDollars.csv, it is important to have the headers for each column, so that we can correctly assign the values for the key and value based on column headers. This is performed using the rowconverter function.
An example of the output using the rowconverter function is below:
{key: "United States", value: 21.44} 
(where "United States" is derived from the country column of the csv and the value field is derived from the gdp column of the csv file. )
-------------------------------------------------------------------------------------------------------------------------------------------------------
*/

function rowConverter(data) {
    return {
        key : data.country,
        value : +data.gdp
    }
}

d3.csv("GDP2020TrillionUSDollars.csv",rowConverter).then(function(data){
    console.log(data)
    // Return X and Y SCALES (domain). See Chapter 7:Scales (Scott M.) 
    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    5. The domain function function is used as below:
    Let us say we would like to map numbers from [0,10000] onto a range of 0 to 1:
    We can use d3.scale.linear().domain([0,10000]) which help us to map the numbers [0,10000] to the range of [0,1]. The below domain function helps us to map the data to the range specified in xscale and yscale.
    -------------------------------------------------------------------------------------------------------------------------------------------------------
   
    */
    xScale.domain(data.map(function(d){ return d.key; }));
    yScale.domain([0,d3.max(data, function(d) {return d.value; })]);
    
    // Creating rectangular bars to represent the data. 
    // Add comments to explain the code below
    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    7. svg.selectAll('rect') tells the browser to find the svg element and check if there are any rectangles. 
    If it finds rectangles, it returns them in a selection that is an array of elements.
    Let us consider we have data as [1,4,7,8,9]; it will try to find the rectangles in svg and assign the value to each of them if they exist. Let us say it is able to find 2 rectangles, it will link number 1 to first rectangle and number 4 to the second rectangle. Then the enter command will try to append the other three rectangles and link it with the remaining values i.e., 7,8 and 9. Since we have 15 rows, it will try to search for the rectangles in the svg element and link it accordingly else it will append new rectangles and link the respective values. 
    
    
    The transition and the delay functions are used to generate the animation effect for the bars. 
    attr("x",....) helps to define the value on the x-axis of the bars whereas  .attr("y", ...) helps to set the value for y axis (both values are set post scaling).
    The height and width for the bars are then computed using  .attr("width",..) and .attr("height",....)
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    */
    svg.selectAll("rect")
        .data(data)
        .enter()
    
        .append("rect")
        .transition().duration(1000)
        .delay(function(d,i) {return i * 200;})
       .attr("x", function(d) {
            return xScale(d.key);
        })
        .attr("y", function(d) {
            return yScale(d.value);
        })
    
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) {
             return height- yScale(d.value);
        })
        // create increasing to decreasing shade of blue as shown on the output
    
    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    6. This fill attribute is used to set the color for the bars. rgb(0, 0, " + (255/d.value+50) + ")" means that the colors assigned will be the shades of blue. As the value being used is 255/d.value +50, the higher the GDP, darker the shade of the blue and lesser the GDP, lighter the shade of blue.
    -------------------------------------------------------------------------------------------------------------------------------------------------------
   
    */
       .attr("fill", function(d) {
            return "rgb(0, 0, " + (255/d.value+50) + ")";
        });
    // Label the data values(d.value)
    svg.selectAll("text")
                   .data(data)
    
                   .enter()
    
                   .append("text")
    .transition().duration(1000)
        .delay(function(d,i) {return i * 200;})
                   .text(function(d) {
                        return d.value;
                   })
    
    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    6. The below code helps to set the text for each bar. The text(gdp value) is set in the middle of each bar using the appropriate x and y positioning of the text and using the text-anchor attribute. Use .attr("fill", "white"), the color of the text is set to blue.
    -------------------------------------------------------------------------------------------------------------------------------------------------------
   
    */
    
                    .attr("x", function(d,i) {
     // return   x(d.key) + (x(d.key) / 2) - (width/ data.length) / 2;
        return xScale(d.key)+21;
//return (i) * (width / data.length) + (width/ data.length) / 2+0.05;
})
        .attr("y", function(d) {
            return yScale(d.value)+14;
        })
    
                   .attr("font-family", "sans-serif")
                   .attr("font-size", "11px")
                   .attr("font-weight", "bold")
                   .attr("fill", "white").attr("text-anchor", "middle");
                    
        
    // Draw xAxis and position the label at -60 degrees as shown on the output 
    
    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    6. .attr("transform", "translate(0,0)rotate(-60)") help to rotate the labels at -60 degrees.
    -------------------------------------------------------------------------------------------------------------------------------------------------------
   
    */
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("dx", "-.8em")
        .attr("dy", ".25em")
        .attr("transform", "translate(0,0)rotate(-60)")
        .style("text-anchor", "end")
        .attr("font-size", "10px");
    
   
    
    

    
    // Draw yAxis and position the label
    /*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    6. The below code is used to draw the y-axis and append/position the label for y-axis using the text attribute and setting it to .text("Trillions of US Dollars ($)") and rotating it by -90 degrees.
    -------------------------------------------------------------------------------------------------------------------------------------------------------
   
    */
    svg.append("g")
    
    .attr("class", "y axis")
 
    .attr("transform", "translate(" +  padding + ",0)")
    .call(yAxis);

    
    svg.append("text")
    
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+12)
    .attr("x", -margin.top-225)
    .text("Trillions of US Dollars ($)")
    .attr("font-weight", "bold")
    .attr("font-size", "12px");
   

    
      
});
