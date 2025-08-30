import React from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { descargarAnexo } from "../../services/download";
import VoteChart from "../delegados/sesion/votaciones/cuadroVotacion";
import { HiDownload } from "react-icons/hi";

interface DetallesSesionProps {
    row: any;
    onHide?: () => void;
}

export const DetallesSesionPasada: React.FC<DetallesSesionProps> = ({
    row,
}) => {
    const votaciones: Array<{
        idEncuesta: string;
        pregunta: string;
        conteo: { deAcuerdo: number; enDesacuerdo: number; abstencion: number };
        resultado: string;
    }> = row.votaciones || [];

    const nombreEvaluado = [
        row.primerNombreEvaluado,
        row.segundoNombreEvaluado,
        row.primerApellidoEvaluado,
        row.segundoApellidoEvaluado,
    ]
        .filter(Boolean)
        .join(" ");

    const handleDescargarActa = async () => {
        try {
            console.log("Iniciando descarga del acta...");
            await descargarAnexo("acta", `Acta_Sesion_${row.id || row.codigo || 'Detalle'}.pdf`);
            console.log("Descarga completada");
        } catch (error) {
            console.error("Error descargando el acta:", error);
        }
    };

    return (
        <>
            <div className="unp-row-subtitle text-start">
                <div className="modal_subtitle_container">
                    <div className="red-section" />
                    <FaCalendarAlt size={20} className="me-2" />
                    <span className="modal-subtitle">Detalles de la Sesión</span>
                </div>
                <div className="subcomision-hover-container">
                    <span className="modal-subtitle-two slide-text">{row.subcomision}</span>
                    <div className="download-wrapper" onClick={handleDescargarActa}>
                        <HiDownload className="download-icon-btn" />
                    </div>
                </div>
            </div>

            <dl className="row text-start">
                <dt className="col-sm-4"><strong>Evaluado:</strong></dt>
                <dd className="col-sm-8">{nombreEvaluado}</dd>

                <dt className="col-sm-4"><strong>Identificación:</strong></dt>
                <dd className="col-sm-8">
                    {row.tipoIdentificacionEvaluado} {row.numeroIdentificacionEvaluado}
                </dd>

                <dt className="col-sm-4"><strong>Fecha Sesión:</strong></dt>
                <dd className="col-sm-8">{row.fechaSubcomision}</dd>
            </dl>

            <h6>Resultados de Votaciones</h6>
            {votaciones.length === 0 && (
                <p className="text-muted">No se realizaron votaciones en esta sesión.</p>
            )}
            {votaciones.map((v) => (
                <div key={v.idEncuesta} className="detalles-sesion-pasada__votacion mb-4 p-3 border rounded bg-light">
                    <div className="detalles-sesion-pasada__votacion-flex">
                        <div className="detalles-sesion-pasada__chart">
                            <VoteChart
                                aFavor={v.conteo.deAcuerdo}
                                enContra={v.conteo.enDesacuerdo}
                                abstencion={v.conteo.abstencion}
                            />
                        </div>
                        <div className="detalles-sesion-pasada__info">
                            <p className="dspp-line"><strong>Pregunta:</strong> {v.pregunta}</p>
                            <p className="dspp-line"><strong>De acuerdo:</strong> {v.conteo.deAcuerdo}</p>
                            <p className="dspp-line"><strong>En desacuerdo:</strong> {v.conteo.enDesacuerdo}</p>
                            <p className="dspp-line"><strong>Abstención:</strong> {v.conteo.abstencion}</p>
                            <p className="dspp-line"><strong>Resultado:</strong> {v.resultado}</p>
                        </div>
                    </div>
                </div>
            ))}

            <dl className="row text-start">
                <dt className="col-sm-4"><strong>Recomendación:</strong></dt>
                <dd className="col-sm-8">{row.recomendacionSubcomision}</dd>
            </dl>

        </>
    );
};
