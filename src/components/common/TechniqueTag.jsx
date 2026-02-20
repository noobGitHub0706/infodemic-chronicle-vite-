import { TECHNIQUES } from '../../data/techniques';

export const TechniqueTag = ({ techniqueId }) => {
            const tech = TECHNIQUES[techniqueId];
            if (!tech) return null;
            return (
                <span 
                    className={`technique-tag ${tech.bgColor} ${tech.textColor} border ${tech.borderColor}`}
                >
                    {tech.name}
                </span>
            );
        };
