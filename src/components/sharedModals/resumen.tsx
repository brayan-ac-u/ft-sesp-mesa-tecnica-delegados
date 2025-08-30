import React from 'react';
import { FaUser } from 'react-icons/fa';
import { Button, Row, Col } from 'react-bootstrap';
import '../../styles/modal.css';
import { useNavigate } from 'react-router-dom';

export interface ResumenEstudioProps {
    row: any;
    basePath: string;
}

export const ResumenEstudio: React.FC<ResumenEstudioProps> = ({ row, basePath }) => {
    const navigate = useNavigate();

    const handleVerCompleto = () => {
        sessionStorage.setItem('unp_openModalRegistro', row.registro);
        navigate(`${basePath}/estudio`, { state: { fromRegistro: row.registro } });
    };

    const {
        primerNombre,
        segundoNombre = '',
        primerApellido,
        segundoApellido = '',
        tipoIdentificacion,
        numeroIdentificacion,
        ot,
        tipoEstudio,
        fechaExpedicion,
        departamento,
        municipio,
        edad,
        primerNombreAnalista,
        segundoNombreAnalista = '',
        primerApellidoAnalista,
        segundoApellidoAnalista = '',
    } = row;

    const nombreEvaluado = [primerNombre, segundoNombre, primerApellido, segundoApellido]
        .filter(Boolean)
        .join(' ');

    const analistaDeRiesgo = [primerNombreAnalista, segundoNombreAnalista, primerApellidoAnalista, segundoApellidoAnalista]
        .filter(Boolean)
        .join(' ');

    return (
        <div className="resumen-estudio-modal">
            <div className="unp-row-subtitle text-start">
                <div className="modal_subtitle_container">
                    <div className="red-section" />
                    <FaUser size={20} className="me-2" />
                    <span className="modal-subtitle">{nombreEvaluado}</span>
                </div>
                <div>
                    <span className="modal-subtitle-two">{ot}</span>
                </div>
            </div>

            <div className="resumen-estudio-modal__grid">
                <Row>
                    <Col sm={6}>
                        <dt>Nombre del Evaluado:</dt>
                        <dd>{nombreEvaluado}</dd>
                    </Col>
                    <Col>
                        <dt>Analista de Riesgo:</dt>
                        <dd>{analistaDeRiesgo}</dd>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <dt>Identificación:</dt>
                        <dd>{tipoIdentificacion} {numeroIdentificacion}</dd>
                    </Col>
                    <Col sm={6}>
                        <dt>Ubicación:</dt>
                        <dd>{departamento} / {municipio}</dd>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <dt>Edad:</dt>
                        <dd>{edad} años</dd>
                    </Col>
                    <Col sm={6}>
                        <dt>Fecha de Expedición:</dt>
                        <dd>{fechaExpedicion}</dd>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <dt>Tipo de Estudio:</dt>
                        <dd>{tipoEstudio}</dd>
                    </Col>
                </Row>
            </div>

            <div className="resumen-estudio-modal__footer">
                <Button
                    variant="primary"
                    className="resumen-estudio-modal__btn"
                    onClick={handleVerCompleto}
                >
                    Ver Estudio Completo
                </Button>
            </div>
        </div>
    );
};