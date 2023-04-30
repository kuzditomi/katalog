import "./App.css";
import { RecoilRoot } from "recoil";
import { Importer } from "./importer/Importer";
import { Calendar } from "./calendar/Calendar";
import { AllCharts } from "./chart/AllCharts";

function App() {
    return (
        <RecoilRoot>
            <h1>Kata-log</h1>
            <Importer />
            <div className="container">
                <Calendar />
                <AllCharts />
            </div>
        </RecoilRoot>
    );
}

export default App;
