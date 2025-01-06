import { Globe, Briefcase, GraduationCap, Plane, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  type: 'global' | 'jobs' | 'education' | 'immigration' | 'tech';
  title: string;
}

const icons = {
  global: Globe,
  jobs: Briefcase,
  education: GraduationCap,
  immigration: Plane,
  tech: FileText,
};

export const CategoryCard = ({ type, title }: CategoryCardProps) => {
  const Icon = icons[type];
  
  return (
    <Link 
      to={`/category/${type}`}
      className={`block p-6 rounded-xl bg-category-${type} hover:opacity-90 transition-opacity`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-8 h-8 text-white" />
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
    </Link>
  );
};