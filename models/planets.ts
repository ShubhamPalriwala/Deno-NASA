import {join} from "../deps.ts";
import {BufReader} from "../deps.ts";
import {parse} from "../deps.ts";

import * as log from "../deps.ts";

import * as _ from "../deps.ts";

type  Planet=Record <string, string>

let planets:Array<Planet>;


async function loadPlanetData() {
    const path=join("data","cumulative_2020.06.13_03.21.06.csv");
    const file=await Deno.open(path);
    const bufReader=new BufReader(file);

    const result = await parse(bufReader,{
        header:true,
        comment:"#"
    })
    Deno.close(file.rid);

    const planets=(result as Array<Planet>).filter((planet)=>{
        const planetaryRadius=Number(planet["koi_prad"]);
        const stellarRadius=Number(planet["koi_srad"]);

        return((planet["koi_disposition"]==="CONFIRMED") && (planetaryRadius>0.5 && planetaryRadius<1.5) && (stellarRadius>0.99 && stellarRadius<1.01));
    })

    return planets.map((planet)=>{
        return _.pick(planet,[
            "koi_prad",
            "koi_srad",
            "kepler_name",
            "koi_steff"
        ])
    });
}

planets=await loadPlanetData()

console.log(`${planets.length} habitable planets found.`)

export function getAllPlanets(){
    return planets
}
