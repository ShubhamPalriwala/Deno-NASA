import {join} from "https://deno.land/std/path/mod.ts";
import {BufReader} from "https://deno.land/std/io/bufio.ts";
import {parse} from "https://deno.land/std/encoding/csv.ts";

import * as _ from "https://deno.land/x/lodash@4.17.15-es/lodash.js";

interface Planet{
    [key:string]: string
}

async function loadPlanetData() {
    const path=join(".","cumulative_2020.06.13_03.21.06.csv");
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

const newEarths=await loadPlanetData()
for(const planet of newEarths){
    console.log(planet)
}
console.log(`${newEarths.length} habitable planets found.`)
