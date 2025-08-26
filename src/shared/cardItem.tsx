import React from "react";
import "../styles/home.css";

interface CardItemProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  onClick: () => void;
}

const CardItem: React.FC<CardItemProps> = ({
  title,
  description,
  icon,
  color,
  onClick
}) => {
  return (
    <div className="cardHome" style={{ backgroundColor: color }} onClick={onClick}>
      <div className="iconHome">{icon}</div>
      <h3 className="cardTitleHome">{title}</h3>
      <p className="cardDescriptionHome">{description}</p>
    </div>
  );
};

export default CardItem;
