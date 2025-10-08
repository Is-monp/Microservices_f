import React from 'react';
import './Statscard.scss';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'yellow' | 'purple' | 'green' | 'blue';
  icon: React.ReactElement;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, color, icon }) => {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card__content">
        <div className="stats-card__info">
          <h3 className="stats-card__title">{title}</h3>
          <p className="stats-card__subtitle">{subtitle}</p>
          <p className="stats-card__value">{value}</p>
        </div>
        <div className="stats-card__icon-container">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;