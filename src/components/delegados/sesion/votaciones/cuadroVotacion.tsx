import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
    Chart,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface VoteChartProps {
    aFavor: number;
    enContra: number;
    abstencion: number;
}

const TOTAL_VOTANTES = 10;

const VoteChart: React.FC<VoteChartProps> = ({
    aFavor,
    enContra,
    abstencion
}) => {
    const totalEmitidos = aFavor + enContra + abstencion;
    const faltan = Math.max(0, TOTAL_VOTANTES - totalEmitidos);

    const data = {
        labels: ["De acuerdo", "En desacuerdo", "Abstención", "Faltan por votar"],
        datasets: [
            {
                data: [aFavor, enContra, abstencion, faltan],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(200, 200, 200, 0.6)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(200, 200, 200, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (context: any) {
                        const valor = context.raw as number;
                        const porcentaje = (
                            (valor / TOTAL_VOTANTES) *
                            100
                        ).toFixed(0);
                        return `${context.label}: ${valor} (${porcentaje}%)`;
                    },
                },
            },
        },
        cutout: "50%",
    };

    return (
        <div style={{ maxWidth: 300, margin: "0 auto" }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default VoteChart;
