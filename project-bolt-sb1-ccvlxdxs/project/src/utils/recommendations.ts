type CareerRecommendation = {
  career: string;
  description: string;
  resources: {
    title: string;
    url: string;
  }[];
};

const careerDatabase: Record<string, CareerRecommendation[]> = {
  'tech-driven': [
    {
      career: 'Software Developer',
      description: 'Build and maintain software applications using programming languages and frameworks.',
      resources: [
        { title: 'Learn to Code', url: 'https://www.freecodecamp.org' },
        { title: 'Developer Jobs', url: 'https://stackoverflow.com/jobs' },
        { title: 'GitHub Learning Lab', url: 'https://skills.github.com' }
      ]
    },
    {
      career: 'Data Scientist',
      description: 'Analyze complex data sets to help organizations make better decisions.',
      resources: [
        { title: 'Kaggle Courses', url: 'https://www.kaggle.com/learn' },
        { title: 'Data Science Jobs', url: 'https://www.datasciencecentral.com/jobs' },
        { title: 'Analytics Vidhya', url: 'https://www.analyticsvidhya.com' }
      ]
    },
    {
      career: 'DevOps Engineer',
      description: 'Bridge the gap between development and operations teams to improve deployment efficiency.',
      resources: [
        { title: 'DevOps Roadmap', url: 'https://roadmap.sh/devops' },
        { title: 'Linux Foundation', url: 'https://training.linuxfoundation.org' },
        { title: 'DevOps Jobs', url: 'https://www.devopsjobs.net' }
      ]
    }
  ],
  'people-focused': [
    {
      career: 'Human Resources Manager',
      description: 'Oversee employee relations, recruitment, and organizational development.',
      resources: [
        { title: 'SHRM Resources', url: 'https://www.shrm.org' },
        { title: 'HR Certification', url: 'https://www.hrci.org' },
        { title: 'HR Jobs', url: 'https://www.hrjobs.com' }
      ]
    },
    {
      career: 'Sales Manager',
      description: 'Lead sales teams and develop strategies to increase revenue.',
      resources: [
        { title: 'Sales Training', url: 'https://www.salesforce.com/trailhead' },
        { title: 'Sales Jobs', url: 'https://www.salesjobs.com' },
        { title: 'Sales Hacker', url: 'https://www.saleshacker.com' }
      ]
    },
    {
      career: 'Teacher/Educator',
      description: 'Educate and inspire students in various subjects and grade levels.',
      resources: [
        { title: 'Teaching License', url: 'https://www.teach.org' },
        { title: 'Education Jobs', url: 'https://www.schoolspring.com' },
        { title: 'Teacher Resources', url: 'https://www.teacherspayteachers.com' }
      ]
    }
  ],
  'creative-thinking': [
    {
      career: 'UX/UI Designer',
      description: 'Design user-friendly interfaces for websites and applications.',
      resources: [
        { title: 'Design Resources', url: 'https://www.interaction-design.org' },
        { title: 'Designer Jobs', url: 'https://www.dribbble.com/jobs' },
        { title: 'UX Tools', url: 'https://www.uxtools.co' }
      ]
    },
    {
      career: 'Content Strategist',
      description: 'Develop and implement content strategies across various platforms.',
      resources: [
        { title: 'Content Marketing', url: 'https://contentmarketinginstitute.com' },
        { title: 'Writing Jobs', url: 'https://www.contena.co' },
        { title: 'Strategy Tools', url: 'https://www.semrush.com' }
      ]
    },
    {
      career: 'Art Director',
      description: 'Lead creative teams and oversee visual style and image.',
      resources: [
        { title: 'Design Inspiration', url: 'https://www.behance.net' },
        { title: 'Creative Jobs', url: 'https://www.coroflot.com/jobs' },
        { title: 'Portfolio Platform', url: 'https://www.artstation.com' }
      ]
    }
  ]
};

export const getCareerRecommendations = (formData: Record<string, string>): string[] => {
  const recommendations: string[] = [];

  if (formData.preferences) {
    const careers = careerDatabase[formData.preferences] || [];
    
    careers.forEach(career => {
      if (formData.educationLevel === 'master' || 
          (formData.educationLevel === 'bachelor' && career.career !== 'Data Scientist') ||
          (formData.educationLevel === 'high-school' && career.career === 'Sales Manager')) {
        
        if ((formData.salary === 'above-100k' && ['Software Developer', 'Data Scientist', 'DevOps Engineer'].includes(career.career)) ||
            (formData.salary === '50k-100k') ||
            (formData.salary === 'below-50k' && ['Teacher/Educator'].includes(career.career))) {
          
          const resourceLinks = career.resources
            .map(resource => `<a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 underline">${resource.title}</a>`)
            .join(' • ');

          recommendations.push(
            `<div class="space-y-2">
              <h3 class="text-xl font-semibold">${career.career}</h3>
              <p>${career.description}</p>
              <div class="text-sm mt-2">
                🔗 Resources: ${resourceLinks}
              </div>
            </div>`
          );
        }
      }
    });
  }

  if (recommendations.length === 0) {
    const generalResources = {
      'IT': [
        { title: 'Technology Consultant', description: 'Help organizations implement and optimize their technology solutions.', links: [
          { title: 'Tech Consulting Jobs', url: 'https://www.dice.com' },
          { title: 'IT Certifications', url: 'https://www.comptia.org' }
        ]},
        { title: 'IT Project Manager', description: 'Lead technology projects and coordinate between teams.', links: [
          { title: 'PMI Resources', url: 'https://www.pmi.org' },
          { title: 'Project Jobs', url: 'https://www.projectmanagement.com/jobs' }
        ]}
      ],
      'healthcare': [
        { title: 'Healthcare Administrator', description: 'Manage healthcare facilities and improve patient care systems.', links: [
          { title: 'Healthcare Admin Jobs', url: 'https://www.healthecareers.com' },
          { title: 'ACHE Resources', url: 'https://www.ache.org' }
        ]},
        { title: 'Health Informatics Specialist', description: 'Bridge healthcare and technology to improve patient care.', links: [
          { title: 'HIMSS Resources', url: 'https://www.himss.org' },
          { title: 'Health IT Jobs', url: 'https://www.healthitjobs.com' }
        ]}
      ]
    };

    if (formData.industry === 'IT' || formData.industry === 'healthcare') {
      const industryResources = generalResources[formData.industry as keyof typeof generalResources];
      industryResources.forEach(resource => {
        const links = resource.links
          .map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 underline">${link.title}</a>`)
          .join(' • ');

        recommendations.push(
          `<div class="space-y-2">
            <h3 class="text-xl font-semibold">${resource.title}</h3>
            <p>${resource.description}</p>
            <div class="text-sm mt-2">
              🔗 Resources: ${links}
            </div>
          </div>`
        );
      });
    } else {
      recommendations.push(
        `<div class="space-y-2">
          <h3 class="text-xl font-semibold">General Career Resources</h3>
          <p>Explore these platforms to find opportunities across various industries:</p>
          <div class="text-sm mt-2">
            🔗 Resources: 
            <a href="https://www.linkedin.com/jobs" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 underline">LinkedIn Jobs</a> • 
            <a href="https://www.indeed.com" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 underline">Indeed</a> • 
            <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" class="text-indigo-300 hover:text-indigo-200 underline">Coursera</a>
          </div>
        </div>`
      );
    }
  }

  return recommendations;
};