import { Route } from "react-router-dom";
import BandejaEntradaDelegados from "../pages/bandejaEntrada";

export const DelegadosRutas = () =>(
    <Route path="sesp/mesaTDelegados">
        <Route path="bandejaEntrada" element={<BandejaEntradaDelegados/>} />
    </Route>
)