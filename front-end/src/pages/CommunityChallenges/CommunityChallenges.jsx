import "./CommunityChallenges.css";
import { useState } from "react";

function CommunityChallenges(){ 
   
   const [showVHard, setShowVHard] = useState(false);
   const [showHard, setShowHard] = useState(false);
   const [showMedium, setShowMedium] = useState(false);
   const [showEasy, setShowEasy] = useState(false);

   const [LB, setLB] = useState([]);
   const [name, setName] = useState([]);
   const [co2, setCo2] = useState([]);

   function leaderboard(){
    if(name.trim() === "" || co2 === "") return;
    setLB([...LB, {name, co2}]);
    setName("");
    setCo2("");
   }

    return (
        <div className="page">
            
            <div className="box">
        <section> {/* Intro/Title */}
            <h1 className="title"><u>Community Challenges</u></h1>
            <h2> Welcome to the Community Challenge page! </h2>
        <p className="intro">. Here you will find challenges we task users with to make sure they keep a 
        low carbon footprint while eating.
        <br /> 
        . We also offer a leaderboard for those who want to
        show off their record of eating clean and completing tasks.</p>
        </section>
        </div>

            <div className="box">
        <section> {/* Challenges */}
        <br />
        <h2>Cut Carbon Challenges (Click on them for more info!):</h2>
        <dl>

            <dt><b onClick={() => setShowVHard(!showVHard)}
            style={{cursor: "pointer"}}>
               <span className="VH"> Very Hard:</span> Vegan Week (25kg saved)</b></dt>
              {showVHard &&(  
            <dd>. Your task is to take on a vegan diet for one week - that means no products are to be consumed that are 
                from animals. 
                <br />. This is very good for cutting carbon as the average omnivore consumes 50kg of CO2 however the vegan diet cuts that figure in half.</dd> 
              )}

            
            <dt><b onClick={() => setShowHard(!showHard)}
                style={{cursor: "pointer"}}>
               <span className="H"> Hard:</span> Week Under 20kg (20kg saved)</b></dt>
                {showHard &&(
            <dd>. This challenge is designed for those who may not be able to give up animal products, as you are tasked with swapping your high carbon beef and lamb for chicken or fish.
                <br />. As there is still a consuming of meat products, the CO2 saved is not as much as a full vegan diet but the cut of higher carbon products does still make a great difference.</dd>
                )}
            

            <dt><b onClick={() => setShowMedium(!showMedium)}
                style={{cursor: "pointer"}}>
               <span className="M"> Medium:</span> Vegetarian Week (12kg saved)</b></dt>
                {showMedium &&(
            <dd>. The challenge entails the eating of no meat products at all. Substitutes for meat could be plant based products like beans or tofu. 
                <br />. It is much easier than a vegan diet as dairy is still allowed but not as impactful.  </dd>
                )}
            
            
            <dt><b onClick={() => setShowEasy(!showEasy)}
                style={{cursor: "pointer"}}>
               <span className="E"> Easy:</span> Fortnight Local Ingredients (6kg saved)</b></dt>
                {showEasy &&(
            <dd>. A very easy task of because for two weeks, instead of shopping at supermarkets the swap to farmer markets or locally sourced products will reduce your weekly carbon consumption. 
                <br />. You will have less of an impact as produce is fresh so it spoils much later than store bought allowing it to be used fully with no waste.</dd>
                )}

            </dl>
        </section>
            </div>

            <div className="box">
        <section> {/* Leaderboard */}
        <br />
        <h2>CCC Leaderboard:</h2>
        
        <table>
            <tr>
            <th>Name</th>
            <th>CO2 Saved (in kg)</th>
            </tr>

            {LB.map((item, index) => (
                <tr key = {index}>
                    <td>{item.name}</td>
                    <td>{item.co2}</td>
                </tr>
            ))}

        </table>
        </section>
            </div>


            <div className="box">
         <section> {/* Joining Leaderboard */}
        <h2>Join the leaderboard:</h2>

        <div className="row">
            <div className="Name">
        <label htmlFor="name"><b>Name:</b> </label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/><br />
        </div>

        <div className="CO2">
        <label htmlFor="number"><b>CO2 Saved:</b> </label>
        <input type="number" id="number" value={co2} onChange={(e) => setCo2(e.target.value)} /><br />
        </div>

        <button onClick={leaderboard}>Join Leaderboard</button>
        </div>
         </section>
            </div>

        </div>
    )
}
export default CommunityChallenges;