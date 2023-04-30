import "./App.css";
import { RecoilRoot } from "recoil";
import { Importer } from "./importer/Importer";

function App() {
    return <RecoilRoot>
      <h1>Kata-log</h1>
      <Importer/>
    </RecoilRoot>;
}

export default App;
