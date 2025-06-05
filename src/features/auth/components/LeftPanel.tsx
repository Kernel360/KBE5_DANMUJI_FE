import React from 'react';

const features = [
  "효율적인 프로젝트 관리 시스템",
  "팀 협업 및 커뮤니케이션 향상",
  "실시간 데이터 분석 및 보고서"
];

const icons = [
  "fa-tasks",
  "fa-users",
  "fa-chart-bar"
];

const LeftPanel: React.FC = () => (
  <div className="w-1/2 bg-yellow-400 p-12 flex flex-col justify-center text-white">
    <h1 className="text-2xl font-bold mb-1">단계별 무리없는 지원 시스템</h1>
    <p className="mb-10">Project Management System</p>
    <div className="space-y-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-start">
          <i className={`fas ${icons[index]} mr-3 mt-1`}></i>
          <p>{feature}</p>
        </div>
      ))}
    </div>
  </div>
);

export default LeftPanel;