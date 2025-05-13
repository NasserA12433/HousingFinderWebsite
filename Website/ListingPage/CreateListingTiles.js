function CreateListingTiles(image, description, price, distance, id) {

  //create a tile by using a div with an id
  id=""+id
  const tile = document.createElement('div');
  tile.setAttribute("id", id);

  //add stuff to tiless
  const text = document.createElement('p');
  text.innerHTML='insert description here'
  tile.appendChild(text);

  //append tile to page
  document.getElementById('TileSpaces').appendChild(tile);


}

function ClearListing() {
  document.getElementById("TileSpaces").innerHTML = "";
}
