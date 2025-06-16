import ProjectHeader from '../components/Header/ProjectHeader';
import ProjectProgress from '../components/Progress/ProjectProgress';
import ProjectBoard from '../components/Board/ProjectBoard';
import ProjectMemberList from '../components/MemberList/ProjectMemberList';
import ProjectFileList from '../components/FileList/ProjectFileList';

const ProjectDetailPage = () => {
    return (
        <div>
            <ProjectHeader />
            <ProjectMemberList />
            <ProjectProgress />
            <div style={{ display: 'flex', gap: 24 }}>
                <div style={{ flex: 2 }}>
                    <ProjectBoard />
                    {/* <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
                        <ProjectFileList />
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage; 