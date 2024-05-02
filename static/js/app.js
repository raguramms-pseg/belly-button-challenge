
function init() {
  // Reference to the dropdown select element
  dropdownMenu = d3.select("#selDataset");

  // Populate the select options using list of sample names
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    sampleNames = data.names;

    sampleNames.forEach((sample) => {
      dropdownMenu
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Build the initial plots using first sample
    Sample = sampleNames[0];
    DisplaySelectedData(Sample);
    plotCharts(Sample);
  });
};

// Render Initialize dashboard
init();

// Fetch data and plot each time a new sample is selected from drop down
function optionChanged(newSample) {
  DisplaySelectedData(newSample);
  plotCharts(newSample);
  
};

// Demographics Panel 
function DisplaySelectedData(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  seldata = data.metadata;
  // Filter the data for the object with the desired sample number
  resultArray = seldata.filter(sampleObj => sampleObj.id == sample);
  result = resultArray[0];
  // Use d3 to select the panel with id of `#sample-metadata`
  selectedData = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
  selectedData.html("");

  // Use `Object.entries` to add each key and value pair to the panel
  Object.entries(result).forEach(([key, value]) => {
    selectedData.append("h6").text(`${key.toUpperCase()}: ${value}`);
  });

});
}

// Create a horizontal bar chart to display the top 10 OTUs found in that individual.

function plotCharts(sample) {
// Use d3.json to load and retrieve the samples.json file 
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
//Create a variable that holds the samples array. 
  sampleArray = data.samples;
     
  //Create a variable that filters the samples passed to function.
  chart = sampleArray.filter(sampleObj => sampleObj.id == sample);

  // Create a variable that holds the sample in an array.
  ArraySample = chart[0];
    
  //Create variables that hold the otu_ids, otu_labels, and sample_values.
  Ids = ArraySample.otu_ids;
  Labels = ArraySample.otu_labels;
  sampleValues = ArraySample.sample_values;
  
  yticks = Ids.slice(0,10).map(OTU => "OTU " + OTU).reverse();

    //Create the trace for the bar chart. 
  trace = {
    type: "bar",
    text: Labels.slice(0,10).reverse(),
    x: sampleValues.slice(0,10).reverse(),
    y: yticks,
    hovertext: Labels,
    orientation: 'h'
  };

  barData = [trace];

  // Create the layout for the bar chart. 
  barLayout = {
    title: "<b>Top 10 Bacteria Cultures Found</b>",
    xaxis:{title: "Number of Bacteria"},

       };
  //Use Plotly to plot the data with the layout. 
  Plotly.newPlot('bar',barData, barLayout);
  
  // Create the trace for the bubble chart. uses sample alues for marker size 

  trace2 = {
    x: Ids,
    y: sampleValues,
    mode: 'markers',
    hovertext: Labels,
    marker: {
      color: Ids,
      size: sampleValues,
      colorscale: "Earth"
    }
  };

 bubbleData = [trace2];
 title = "Bacteria Cultures per sample"
  // Create the layout for the bubble chart.
    bubbleLayout = {
    title: title,
    xaxis:{title: "OTU ID"},
    yaxis:{title: "Number of Bacteria"}
  
  };

  //  Use Plotly to plot the data with the layout.

  Plotly.newPlot('bubble',bubbleData, bubbleLayout);

});
 
};

