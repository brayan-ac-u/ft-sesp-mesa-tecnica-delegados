import React, { useState, useMemo, useEffect } from "react";
import { BootstrapTable } from "../../../shared/tabla";
import data from "../../../services/delegados/dataConsolidadoCasos.json";
import { Reparto } from "../../sharedModals/reparto";
import { Anexos } from "../../sharedModals/anexos";
import { ResumenEstudio } from "../../sharedModals/resumen";
import { useLocation } from 'react-router-dom';

const buildNombre = (
    primer: string,
    segundo: string,
    papellido: string,
    sapellido: string
) =>
    [primer, segundo, papellido, sapellido]
        .filter(Boolean)
        .join(" ");

const calculateBusinessDays = (start: Date, end: Date): number => {
    let count = 0;
    const cur = new Date(start);
    cur.setHours(0, 0, 0, 0);
    const last = new Date(end);
    last.setHours(0, 0, 0, 0);

    cur.setDate(cur.getDate() + 1);
    while (cur <= last) {
        const dow = cur.getDay();
        if (dow !== 0 && dow !== 6) {
            count++;
        }
        cur.setDate(cur.getDate() + 1);
    }
    return count;
};

const columns: any[] = [
    { key: "canal", label: "Canal" },
    { key: "registro", label: "Registro", hasModal: true },
    { key: "ot", label: "OT", hasModal: true },
    { key: "nombreEvaluado", label: "Nombre del Evaluado" },
    { key: "identificacionEvaluado", label: "Identificación" },
    { key: "fechaEmision", label: "Fecha de Emisión" },
    {
        key: "diasDesdeFecha",
        label: "Días Transc.",
        semaphoreRules: [
            { max: 2, backgroundColor: "#3AB34A", color: "#FFF" },
            { min: 3, max: 4, backgroundColor: "#F8EB10", color: "#000" },
            { min: 5, max: 7, backgroundColor: "#F79122", color: "#000" },
            { min: 8, backgroundColor: "#E91720", color: "#FFF" },
        ],
    },
    {
        key: "nSesiones",
        label: "No. Sesiones",
        semaphoreRules: [
            { max: 1, backgroundColor: "#3AB34A", color: "#FFF" },
            { min: 2, max: 3, backgroundColor: "#F8EB10", color: "#000" },
            { min: 4, max: 4, backgroundColor: "#F79122", color: "#000" },
            { min: 5, backgroundColor: "#E91720", color: "#FFF" },
        ],
    },
    { key: "analistaRiesgo", label: "Analista de Riesgo" },
    { key: "nivelRiesgo", label: "Nivel de Riesgo" },
    { key: "departamento", label: "Departamento" },
    { key: "municipio", label: "Municipio" },
    { key: "tipoEstudio", label: "Tipo de Estudio" },
    { key: "fechaProgramada", label: "Fecha de Sesión " },
    { key: "anexos", label: "Anexos", hasModal: true },
];

const renderModalContent = (row: any, column: any) => {
    switch (column.key) {
        case "registro":
            return <Reparto row={row} />;
        case "ot":
            return (
                <ResumenEstudio
                    row={row}
                    basePath="/sesp/gps/subcomisiones/insercion"
                />
            );
        case "anexos":
            return <Anexos row={row} />;
        default:
            return (
                <p className="text-center text-muted">
                    No hay información adicional disponible.
                </p>
            );
    }
};

const TablaCasos: React.FC = () => {
    const today = new Date();

    const enrichedData = useMemo(() => {
        return data.map(row => {
            const nombreEvaluado = buildNombre(
                row.primerNombreEvaluado,
                row.segundoNombreEvaluado,
                row.primerApellidoEvaluado,
                row.segundoApellidoEvaluado
            );
            const identificacionEvaluado = `${row.tipoIdentificacionEvaluado} ${row.numeroIdentificacionEvaluado}`;
            const analistaRiesgo = buildNombre(
                row.primerNombreAnalista,
                row.segundoNombreAnalista,
                row.primerApellidoAnalista,
                row.segundoApellidoAnalista
            );
            const diasDesdeFecha = calculateBusinessDays(
                new Date(row.fechaEmision),
                today
            );

            return {
                ...row,
                nombreEvaluado,
                identificacionEvaluado,
                analistaRiesgo,
                diasDesdeFecha,
            };
        });
    }, [data, today]);

    const location = useLocation();
    const stateRegistro = (location.state as any)?.openModalRegistro as string | undefined;
    const [initialModalRegistro, setInitialModalRegistro] = useState<string | undefined>(stateRegistro);

    useEffect(() => {
        if (!stateRegistro) {
            const stored = sessionStorage.getItem('unp_openModalRegistro');
            if (stored) {
                setInitialModalRegistro(stored);
                sessionStorage.removeItem('unp_openModalRegistro');
            }
        }
    }, [stateRegistro]);

    return (
        <BootstrapTable
            columns={columns}
            data={enrichedData}
            subtitle="Inserción de Medidas y Actas"
            items="Casos Entrantes"
            enableColumnSearch={false}
            renderModalContent={renderModalContent}
            initialModalRegistro={initialModalRegistro}
            initialModalColumnKey="ot"
        />
    );
};

export default TablaCasos;
