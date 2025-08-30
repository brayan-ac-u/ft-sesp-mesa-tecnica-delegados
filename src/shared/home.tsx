import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import CardItem from "./cardItem";
import { FaFileSignature } from "react-icons/fa";


const Home: React.FC = () => {
    const navigate = useNavigate();


    const options = [
        {
            id: 1,
            title: "Delegados",
            description:
                "Delegados de mesa tecnica.",
            icon: <FaFileSignature size={40} color="#3498db" />,
            color: "#eaf2f8",
            route: "sesp/mesaTDelegados/bandejaEntrada",
        },
        {
            id: 2,
            title: "Votaciones",
            description:
                "- Votaciones en subcomisiones o mesa tecnica -",
            icon: <FaFileSignature size={40} color="#3498db" />,
            color: "#eaf2f8",
            route: "sesp/mesaTDelegados/bandejaEntrada",
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
