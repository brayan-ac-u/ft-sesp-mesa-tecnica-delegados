import { FaUser } from 'react-icons/fa';
import '../../styles/modal.css';
import DatosReparto from '../../shared/datosReparto';

export const Reparto: React.FC<any> = ({ row }) => {
  const {
    primerNombreEvaluado,
    segundoNombreEvaluado = '',
    primerApellidoEvaluado,
    segundoApellidoEvaluado = ''
  } = row;

  const nombreCompleto = [primerNombreEvaluado, segundoNombreEvaluado, primerApellidoEvaluado, segundoApellidoEvaluado]
    .filter(Boolean)
    .join(' ');

  return (
    <div>
      <div className='unp-row-subtitle'>
        <div className='modal_subtitle_container'>
          <div className='red-section'></div>
          <FaUser />
          <span className='modal-subtitle'>{nombreCompleto}</span>
        </div>
        <div>
          <span className='modal-subtitle-two'>{row.ot}</span>
        </div>
      </div>
      <DatosReparto />
    </div>
  );
};
