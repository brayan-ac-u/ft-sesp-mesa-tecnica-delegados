import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import CardItem from "./cardItem";
import { MdEvent } from "react-icons/md";
import { FaFileSignature } from "react-icons/fa";


const Home: React.FC = () => {
    const navigate = useNavigate();


    const options = [
        {
            id: 1,
            title: "Moderador Subcomisión",
            description:
                "Encargado de agendar reuniones, invitar a los asistentes y definir la prioridad y casos a tratar.",
            icon: <MdEvent size={40} color="#2ecc71" />,
            color: "#e8f8f5",
            route: "/sesp/gps/subcomisiones/moderador/tablaCasos",
        },
        {
            id: 2,
            title: "Inserción de Medidas y Actas Subcomisión",
            description:
                "Gestión de la inserción de medidas de protección y actas de sesiones.",
            icon: <FaFileSignature size={40} color="#3498db" />,
            color: "#eaf2f8",
            route: "/sesp/gps/subcomisiones/insercion/bandejaCasos",
        }
    ];


    return (
        <div className="containerHome">
            <div className="gridHome">
                {options.map((option) => (
                    <CardItem
                        key={option.id}
                        {...option}
                        onClick={() => navigate(option.route)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Home;
