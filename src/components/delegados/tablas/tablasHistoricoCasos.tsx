import React, { useMemo } from "react";
import { BootstrapTable } from "../../../shared/tabla";
import dataHistorico from "../../../services/delegados/dataHistoricoCasos.json";
import { DetallesSesionPasada } from "../../sharedModals/detallesSesionPasada";

const buildNombre = (
    primer: string,
    segundo: string,
    papellido: string,
    sapellido: string
) =>
    [primer, segundo, papellido, sapellido]
        .filter(Boolean)
        .join(" ");

const HistoricoCasos: React.FC = () => {
    const enrichedData = useMemo(() => {
        return dataHistorico.map((row) => {
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
            return {
                ...row,
                nombreEvaluado,
                identificacionEvaluado,
                analistaRiesgo,
            };
        });
    }, []);

    const columns: any[] = [
        { key: "canal", label: "Canal" },
        { key: "registro", label: "Registro" },
        { key: "ot", label: "OT" },
        { key: "nombreEvaluado", label: "Nombre del Evaluado" },
        { key: "identificacionEvaluado", label: "Identificación" },
        { key: "fechaEmision", label: "Fecha de Emisión" },
        { key: "analistaRiesgo", label: "Analista de Riesgo" },
        {
            key: "fechaSubcomision",
            label: "Fecha de la Sesión",
            hasModal: true,
        },
    ];

    const renderModalContent = (
        row: any,
        column: any,
        onHide: () => void
    ) => {
        if (column.key === "fechaSubcomision") {
            return <DetallesSesionPasada row={row} onHide={onHide} />;
        }
        return null;
    };

    return (
        <BootstrapTable
            columns={columns}
            data={enrichedData}
            subtitle="Subdirección Especializada de Seguridad y Protección"
            items="Casos procesados"
            enableColumnSearch={false}
            renderModalContent={renderModalContent}
        />
    );
};

export default HistoricoCasos;
