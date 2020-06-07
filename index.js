import {promises} from "fs";
import express from "express";
import timesRouter from "./routes/times.js"

const { readFile, writeFile } = promises;

const times = [];

const app = express();
app.use(express.json());
app.use("/times", timesRouter);

app.listen(3000, () => {
    console.log("Api started");
});

init();

async function init(){
    try{
        const resp = await readFile("./2003.json");
        const data = JSON.parse(resp);
    
        data[0].partidas.forEach(partida => {
            times.push({time: partida.mandante, pontuacao: 0});
            times.push({time: partida.visitante, pontuacao:0});
        });

        data.forEach(rodada => {
            rodada.partidas.forEach(partida=>{
                const indexVisitante = times.findIndex(item => item.time === partida.visitante);
                const indexMandante = times.findIndex(item => item.time === partida.mandante);
                
                let timeMandante = times[indexMandante];
                let timeVisitante = times[indexVisitante];

                if (partida.placar_visitante > partida.placar_mandante){
                    timeVisitante.pontuacao += 3;
                } else if (partida.placar_mandante > partida.placar_visitante){
                    timeMandante.pontuacao += 3;
                } else {
                    timeVisitante.pontuacao ++;
                    timeMandante.pontuacao ++;
                }
                times[indexVisitante] = timeVisitante;
                times[indexMandante] = timeMandante;
            });
        });
    
        times.sort((a, b) => b.pontuacao - a.pontuacao);

        await writeFile("times.json",JSON.stringify(times));

        console.log(times);
    
    } catch (err){
        console.log(err);
    }  
}

  




