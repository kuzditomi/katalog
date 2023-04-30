import "./App.css";
import { RecoilRoot } from "recoil";
import { Importer } from "./importer/Importer";
import { Calendar } from "./calendar/Calendar";

function App() {
    return <RecoilRoot>
      <h1>Kata-log</h1>
      <Importer/>
      <Calendar/>
    </RecoilRoot>;
}

export default App;
