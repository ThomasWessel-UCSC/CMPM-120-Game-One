class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        console.log(this.engine.storyData);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // Set the initial story location here
    }
}

class Location extends Scene {
    create(key) {
        let locationData = key;
        this.engine.show(this.engine.storyData.Locations[key].Body);
        if(this.engine.storyData.Locations[key].Choices !== undefined && this.engine.storyData.Locations[key].Choices.length !== 0) {
            for(let choice of this.engine.storyData.Locations[key].Choices) {
                this.engine.addChoice(choice.Text, choice);
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice ) {
            //lets check to see if the choice has a preReq that we need to act on first
            if(choice.preReq !== undefined) {
                if(this.engine.storyData.hasOwnProperty(choice.preReq) && !this.engine.storyData[choice.preReq]){
                    this.engine.show("&gt; "+choice.altMessage);
                    this.engine.gotoScene(Location, choice.altTarget); //if the preReq is met, the story can continue
                    return;
                }
            }

            this.engine.show("&gt; "+choice.Text);

            //I'm just gonna hardcode the keycard thing for now. Want to fix later
            if (["HS_Oakes", "KS_Oakes"].includes(choice.Target) && ["KS_QPlaza", "HS_QPlaza"].includes(this.engine.visitedStack[this.engine.visitedStack.length - 1])) {

                this.engine.show("*** "+"While walking down oaks path, you find a keycard on the ground. Upon closer inspection it's your student ID card. You must have dropped it earlier. You pick it up and put it in your pocket. ***");
                this.engine.storyData.HasKeyCards = true;
                console.log("Keycard acquired");
            }

            //and the check to see if the player found porter.
            if(this.engine.storyData.foundHome !== true && this.engine.visitedStack.includes("Porter") !== false){
                this.engine.storyData.foundHome = true;
            }


            this.engine.gotoScene(Location, choice.Target);


        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');