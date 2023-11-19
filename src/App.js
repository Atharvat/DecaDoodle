import './App.css';
import localforage from "localforage";
import { useState, useEffect } from 'react';
import CarouselItem from "./Components/CarouselItem";

function App() {
    const [carouselItems, setCarouselItems] = useState([
        {
            imgSrc: process.env.PUBLIC_URL + "/placeholder.png",
            text: "",
            type: "generation",
            key: 0
        },
    ]);

    const [currentItem, setCurrentItem] = useState(0);

    async function query(data) {
        // console.log(data);

        /*const response = await fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
                headers: {
                    "Accept": "image/png",
                    "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );
        console.log("got result");
        const result = await response.blob();
        const urlCreator = window.URL || window.webkitURL;
        // const outputImg = document.createElement('img');
        const imgUrl = urlCreator.createObjectURL(result);
        //saveAs(imgUrl, "image1212.png");
        console.log(imgUrl);
        await localforage.setItem("image1212.png", result);
        const gotImage = await localforage.getItem("image1212.png");
        const image = document.getElementById("panel_img"); */

        const response = await fetch(
            "https://source.unsplash.com/random/",
            {
                headers: {
                    "Accept": "image/png",
                    "Content-Type": "application/json"
                },
                method: "GET",
            });
        const result = await response.blob();
        // console.log("got result");
        await localforage.setItem(`image${currentItem}.png`, result);
        const gotImage = await localforage.getItem(`image${currentItem}.png`);
        const urlCreator = window.URL || window.webkitURL;
        const imgUrl = urlCreator.createObjectURL(gotImage);

        //update the state variable with the new image source
        const newCarouselItems = [...carouselItems];
        newCarouselItems[currentItem].imgSrc = imgUrl;
        newCarouselItems[currentItem].text = data.inputs[0];
        newCarouselItems[currentItem].type = "generation";
        newCarouselItems[currentItem].key = currentItem;
        setCarouselItems(newCarouselItems);

        // console.log(newCarouselItems);

        return result;
    }

    function carouselItemClicked(type, key){
        // console.log("clicked");
        // console.log(type, key);
        if(type === "add"){
            //add a new item to the carousel
            const newCarouselItems = [...carouselItems];
            newCarouselItems.push({
                imgSrc: process.env.PUBLIC_URL + "/placeholder.png",
                text: "",
                type: "generation",
                key: newCarouselItems.length
            });
            setCarouselItems(newCarouselItems);
            setCurrentItem(newCarouselItems.length - 1);
        }else if(type === "generation"){
            //set the current item to the clicked item
            setCurrentItem(key);
        }else if(type === "delete"){
            //delete the clicked item
            const newCarouselItems = [...carouselItems];
            newCarouselItems.splice(key, 1);
            setCarouselItems(newCarouselItems);
            setCurrentItem(0);
        }
    }

    function stripClicked(){
        if(carouselItems.length !== 10){
            alert("Please add 10 panels to the comic strip");
            return;
        }
        for(let i=0; i<10; i++){
            if(carouselItems[i].type !== "generation" || carouselItems[i].text === ""){
                alert("Please generate all 10 panels of the comic strip");
                return;
            }
        }
        //create an array with the image urls of the 10 panels
        const imageUrls = [];
        for(let i=0; i<10; i++){
            imageUrls.push(carouselItems[i].imgSrc);
        }

        const rows = 2;
        const columns = 5;
        const gap = 10;
        const background = "#ffffff";
        createCollage(imageUrls, 200, 200, rows, columns, gap, background);
    }

    function createCollage(imageUrls, imageWidth, imageHeight, rows, columns, gap, background) {
        //create a canvas element to draw the collage on
        const canvas = document.createElement("canvas");
        //set the canvas width and height
        canvas.width = columns * (imageWidth + gap) + gap;
        canvas.height = rows * (imageHeight + gap) + gap + 50;
        //get the canvas context
        const context = canvas.getContext("2d");
        //set the background color
        context.fillStyle = background;
        //fill the background color on the canvas
        context.fillRect(0, 0, canvas.width, canvas.height);
        //loop through the images and draw them on the canvas and crop as needed
        for (let i = 0; i < imageUrls.length; i++) {
            //create an image element
            const img = new Image();
            //set the source of the image
            img.src = imageUrls[i];
            img.style.ojectFit = "cover";
            //calculate the x and y position of the image on the canvas
            const x = (i % columns) * (imageWidth + gap) + gap;
            const y = Math.floor(i / columns) * (imageHeight + gap) + gap;
            //draw the image on the canvas
            context.drawImage(img, x, y, imageWidth, imageHeight);
        }
        const logo = new Image();
        logo.src = process.env.PUBLIC_URL + "/decadoodle_logo.png";
        logo.onload = function(){
            context.drawImage(logo, canvas.width - 940/5 -20, canvas.height - 50, 940/5, 228/5);
        }
        context.drawImage(logo, canvas.width - 940/5 -20, canvas.height - 50, 940/5, 228/5);
        context.font = "14px Gabarito";
        context.fillStyle = "#252525";
        context.fillText("atharvat.tech/DecaDoodle", 20, canvas.height - 20);

        //document.body.appendChild(canvas);

        //save the canvas as an image
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = "decadoodle_comic_strip.png";
        link.href = dataURL;
        link.click();

    }

  return (
    <div className="App">
      <header className="app_body">
          <div className="page_header">
              <img className="logo" src={process.env.PUBLIC_URL + "/decadoodle_logo.png"} alt="DecaDoodle logo"/>
              {/*<div className="view_panel_div" onClick={stripClicked}>
                  <div className="view_text">View Comic Strip</div>
                  <img className="download_img" src={process.env.PUBLIC_URL + "/download_icon.png"} alt="download icon"/>
              </div>*/}
              <div className="download_div" onClick={stripClicked}>
                  <div className="download_text">Download Comic Strip</div>
                  <img className="download_img" src={process.env.PUBLIC_URL + "/download_icon.png"} alt="download icon"/>
              </div>
          </div>

          <div className="page_body">
              <div className="instructions">
                  {/*Write introduction for this website in about 200 words and also mention that I am using random images from unsplash as the provided API doesn't seen to be working*/}
                  Welcome to DecaDoodle! This is a website to generate a 10 panel comic strip based on images generated using Gen AI.
                  <br/><br/>
                  To generate a new panel, enter a prompt in the text box below and click on the generate button.
                  {/*The generated comic strip will be displayed on clicking the show comic strip button.*/}
                  You can download the generated comic strip by clicking on the download button on the top right corner of the page.
                  <br/><br/>
                  Note: I am using random images from unsplash as the provided API doesn't seem to be working.
                  <br/><br/>
                  Created by <a href="https://www.linkedin.com/in/atharva-tagalpallewar/" target="_blank">Atharva Tagalpallewar</a>

              </div>
              <div className="panel_img_div">
                  <img className="panel_img" src={carouselItems[currentItem].imgSrc} alt={"carousel item"}/>
              </div>

              <div className="form_div">
                    <textarea className="prompt_input" placeholder="Enter a prompt here" name="Prompt Input"/>
                    <button className="generate_button" onClick={() => {
                        //get the text from the prompt input
                        const promptText = document.getElementsByClassName("prompt_input")[0].value;
                        if(promptText === ""){
                            alert("Please enter a prompt");
                        }else{
                            //call the query function with the prompt text
                            query({"inputs": promptText}).then((response) => {
                                // console.log("Got result");
                            });
                        }
                    }}>Generate</button>
              </div>
          </div>

          <div className="page_footer">
                {carouselItems.map((item) => (
                    <CarouselItem
                        imgSrc={item.text!==""?item.imgSrc:process.env.PUBLIC_URL + "/placeholder_small.png"}
                        text={item.text}
                        type={item.type}
                        key={item.key}
                        id ={item.key}
                        clicked={(type, key) =>carouselItemClicked(type,key)}
                        selected={item.key === currentItem}
                    />
                ))}
              {carouselItems.length < 10 ?
                  <CarouselItem
                      imgSrc={process.env.PUBLIC_URL + "/plus_icon.png"}
                      text=""
                      type="add"
                      key={carouselItems.length}
                      id = {carouselItems.length}
                      clicked={(type,key) =>carouselItemClicked(type,key)}
                      selected={false}
                  /> :null
              }
          </div>
      </header>
    </div>
  );
}




export default App;
