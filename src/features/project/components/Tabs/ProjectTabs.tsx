import { useState } from 'react';
import ProjectBoard from '../Board/ProjectBoard';
import ProjectMemberList from '../MemberList/ProjectMemberList';
import ProjectFileList from '../FileList/ProjectFileList';

const TABS = [
  { key: 'board', label: '게시글관리' },
  { key: 'question', label: '질문관리' },
  { key: 'history', label: '이력관리' },
];

const ProjectTabs = () => {
  const [activeTab, setActiveTab] = useState('board');

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', gap: 32, borderBottom: '2px solid #eee', marginBottom: 24 }}>
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '3px solid #6366F1' : 'none',
              color: activeTab === tab.key ? '#6366F1' : '#222',
              fontWeight: activeTab === tab.key ? 700 : 500,
              fontSize: 18,
              padding: '8px 0',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 2 }}>
          {activeTab === 'board' && <ProjectBoard />}
          {activeTab === 'question' && <div>질문관리 영역 (추후 구현)</div>}
          {activeTab === 'history' && <div>이력관리 영역 (추후 구현)</div>}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <ProjectMemberList />
          <ProjectFileList />
        </div>
      </div>
    </div>
  );
};
export default ProjectTabs; 