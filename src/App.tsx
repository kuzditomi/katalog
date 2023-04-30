import "./App.css";
import { RecoilRoot } from "recoil";
import { Importer } from "./importer/Importer";
import { Calendar } from "./calendar/Calendar";
import { DailyChart } from "./chart/DailyChart";

function App() {
    return <RecoilRoot>
      <h1>Kata-log</h1>
      <Importer/>
      <Calendar/>
      <DailyChart/>
    </RecoilRoot>;
}

export default App;
