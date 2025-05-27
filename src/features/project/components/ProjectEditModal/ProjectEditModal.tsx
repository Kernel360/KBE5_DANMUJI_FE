import React, { useState, useEffect } from "react";
import Select from "react-select";

const companyOptions = [
  { value: "ABC", label: "ABC 주식회사" },
  { value: "DEF", label: "DEF 테크놀로지" },
  { value: "GHI", label: "GHI 시스템즈" },
];

const dummyMembers = [
  { value: "hong", label: "홍길동" },
  { value: "kim", label: "김철수" },
  { value: "park", label: "박영희" },
  { value: "lee", label: "이이름" },
  { value: "choi", label: "최담당" },
];

const statusOptions = [
  { value: "진행중", label: "진행중" },
  { value: "대기", label: "대기" },
  { value: "완료", label: "완료" },
];

interface MemberOption {
  value: string;
  label: string;
}

interface StatusOption {
  value: string;
  label: string;
}

interface ProjectEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    client: string;
    clientManagers: MemberOption[];
    dev: string;
    devManagers: MemberOption[];
    name: string;
    start: string;
    end: string;
    status: string;
  }) => void;
  project: {
    client: string;
    clientManagers: MemberOption[];
    dev: string;
    devManagers: MemberOption[];
    name: string;
    start: string;
    end: string;
    status: string;
  };
}

export default function ProjectEditModal({
  open,
  onClose,
  onSave,
  project,
}: ProjectEditModalProps) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [clientManagers, setClientManagers] = useState<MemberOption[]>([]);
  const [dev, setDev] = useState("");
  const [devManagers, setDevManagers] = useState<MemberOption[]>([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [status, setStatus] = useState<StatusOption>(statusOptions[0]);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setClient(project.client || "");
      setClientManagers(project.clientManagers || []);
      setDev(project.dev || "");
      setDevManagers(project.devManagers || []);
      setStart(project.start || "");
      setEnd(project.end || "");
      setStatus(
        statusOptions.find((opt) => opt.value === project.status) ||
          statusOptions[0]
      );
    }
  }, [project, open]);

  if (!open) return null;

  const handleSave = () => {
    onSave({
      name,
      client,
      clientManagers,
      dev,
      devManagers,
      start,
      end,
      status: status.value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8 relative">
        <div className="text-xl font-bold mb-6">프로젝트 수정</div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              프로젝트명
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="border-b pb-4 mb-4">
            <div className="font-semibold text-gray-700 mb-2">고객사 정보</div>
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">
                고객사명
              </label>
              <Select
                options={companyOptions}
                value={
                  companyOptions.find((opt) => opt.value === client) || null
                }
                onChange={(val) => setClient(val ? val.value : "")}
                placeholder="고객사 선택"
                className="w-full"
                classNamePrefix="react-select"
                isClearable
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                고객사 담당자(다중 선택)
              </label>
              <Select
                isMulti
                options={dummyMembers}
                value={clientManagers}
                onChange={(val) => setClientManagers(val as MemberOption[])}
                placeholder="고객사 담당자 검색/선택"
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>
          </div>
          <div className="border-b pb-4 mb-4">
            <div className="font-semibold text-gray-700 mb-2">개발사 정보</div>
            <div className="mb-2">
              <label className="block text-sm font-semibold mb-1">
                개발사명
              </label>
              <Select
                options={companyOptions}
                value={companyOptions.find((opt) => opt.value === dev) || null}
                onChange={(val) => setDev(val ? val.value : "")}
                placeholder="개발사 선택"
                className="w-full"
                classNamePrefix="react-select"
                isClearable
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                개발사 담당자(다중 선택)
              </label>
              <Select
                isMulti
                options={dummyMembers}
                value={devManagers}
                onChange={(val) => setDevManagers(val as MemberOption[])}
                placeholder="개발사 담당자 검색/선택"
                className="w-full"
                classNamePrefix="react-select"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">시작일</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">종료일</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">상태</label>
            <Select
              options={statusOptions}
              value={status}
              onChange={(val) => setStatus(val as StatusOption)}
              className="w-full"
              classNamePrefix="react-select"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-8">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
