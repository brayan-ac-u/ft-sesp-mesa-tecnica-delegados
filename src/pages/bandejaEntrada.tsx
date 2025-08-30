import React, { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { TablaRegistros } from "react-ecosistema-unp/tables";
import { VentanaLienzo } from "react-ecosistema-unp/shared";

const BandejaEntradaDelegados: React.FC = () => {

    const [activeKey, setActiveKey] = useState<"casosRemitidos" | "vc">("casosRemitidos"); 
    /*el active ve que pestaña es la activa(observador), el set es para cambiar*/

    const columns = [
        {
            key: "n_ot",
            label: "Numero de OT",
            hasModal: true 
            // Se indica que va a haber una accion sobre la celda
        },
        {
            key: "nombre_evaluado",
            label: "Nombre del evaluado"
        },
        {
            key: "enfoque_diferencial",
            label: "Enfoque Diferencial"
        }
    ]

    const data = [
        {
            n_ot: "OT001",
            nombre_evaluado: "Nombre 1",
            enfoque_diferencial: "Enfoque de Genero"
        },
        {
            n_ot: "OT002",
            nombre_evaluado: "Nombre 2",
            enfoque_diferencial: "Enfoque territorial"
        },
        {
            n_ot: "OT003",
            nombre_evaluado: "Nombre 3",
            enfoque_diferencial: "Enfoque de orientacion sexual"
        },
        {
            n_ot: "OT003",
            nombre_evaluado: "Nombre 1",
            enfoque_diferencial: "Enfoque de Genero"
        },
        {
            n_ot: "OT003",
            nombre_evaluado: "Nombre 1",
            enfoque_diferencial: "Enfoque de Genero"
        },
        {
            n_ot: "OT007",
            nombre_evaluado: "Nombre 1",
            enfoque_diferencial: "Enfoque de Genero"
        }
    ]

    const renderModalContent = (
        row : any,
        column: any
    ) =>{
        switch (column.key) {
            case "n_ot":
                return(
                    <div>
                        <h1>prueba</h1>
                        <span>{row.nombre_evaluado}</span>
                    </div>
                )
                break;
        
            default:
                break;
        }
    }

    return (
        <div>
            <VentanaLienzo>
                <Tabs
                    id="bandeja-casos-remitidos-tabs"
                    activeKey={activeKey} 
                    
                    onSelect={(k) => setActiveKey(k as "casosRemitidos" | "vc")}
                    /*Supongo, actualiza la pestaña actual del set que se definio arriba*/
                    // Guarda la pestaña en cache
                    className="mb-3"> 
                    <Tab eventKey= "casosRemitidos" title="Tabla Casos Remitidos">
                        <TablaRegistros
                        columns={columns}
                        data={data}
                        title="Subdireccion Especializada de Seguridad y Proteccion"
                        subtitle="Delegados"
                        enableColumnSearch={true}
                        enableColumnSorter={true}
                        renderModalContent={renderModalContent} />
                    </Tab>
                    <Tab eventKey="vc" title="vacio temporal">
                        <TablaRegistros
                        columns={columns}
                        data={data}
                        title="Subdireccion Especializada de Seguridad y Proteccion"
                        subtitle="Delegados"
                        enableColumnSearch={true}
                        enableColumnSorter={true} />
                    </Tab>
                </Tabs>
                    
            </VentanaLienzo>
        </div>
    );
};

export default BandejaEntradaDelegados;

