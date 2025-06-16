import { useRef, useEffect, useState, type RefObject } from "react";

interface CompanyData {
  name: string;
  companyType: string;
  reg: string;
  addr: string;
  owner: string;
  email: string;
  phone: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CompanyData) => void;
  initialData: CompanyData | null;
}

export default function CompanyEditModal({
  open,
  onClose,
  onSave,
  initialData,
}: Props) {
  const reg2 = useRef<HTMLInputElement>(null!);
  const reg3 = useRef<HTMLInputElement>(null!);

  const [form, setForm] = useState<{
    name: string;
    companyType: string;
    reg1: string;
    reg2: string;
    reg3: string;
    addr: string;
    owner: string;
    email: string;
    phone: string;
  }>({
    name: "",
    companyType: "",
    reg1: "",
    reg2: "",
    reg3: "",
    addr: "",
    owner: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (open && initialData) {
      const [r1 = "", r2 = "", r3 = ""] = (initialData.reg || "").split("-");
      setForm({
        name: initialData.name,
        companyType: initialData.companyType,
        reg1: r1,
        reg2: r2,
        reg3: r3,
        addr: initialData.addr,
        owner: initialData.owner,
        email: initialData.email,
        phone: initialData.phone,
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleRegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    len: number,
    nextRef?: RefObject<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, len);
    const name = e.target.name;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (value.length === len && nextRef?.current) nextRef.current.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: form.name,
      companyType: form.companyType,
      reg: `${form.reg1}-${form.reg2}-${form.reg3}`,
      addr: form.addr,
      owner: form.owner,
      email: form.email,
      phone: form.phone,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-[420px] p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ×
        </button>
        <div className="text-2xl font-bold mb-6">회사 정보 수정</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">회사명</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="회사명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">회사 구분</label>
            <div className="flex gap-6 px-1 py-1">
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="companyType"
                  value="CLIENT"
                  checked={form.companyType === "CLIENT"}
                  onChange={handleChange}
                  required
                  className="accent-[#FFC10A]"
                />
                고객사
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="companyType"
                  value="AGENCY"
                  checked={form.companyType === "AGENCY"}
                  onChange={handleChange}
                  required
                  className="accent-[#FFC10A]"
                />
                개발사
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              사업자등록번호
            </label>
            <div className="flex gap-2">
              <input
                name="reg1"
                value={form.reg1}
                onChange={(e) => handleRegInput(e, 3, reg2)}
                maxLength={3}
                className="w-14 border rounded px-2 py-2 text-center"
                placeholder="000"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span className="self-center">-</span>
              <input
                name="reg2"
                value={form.reg2}
                onChange={(e) => handleRegInput(e, 2, reg3)}
                ref={reg2}
                maxLength={2}
                className="w-10 border rounded px-2 py-2 text-center"
                placeholder="00"
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span className="self-center">-</span>
              <input
                name="reg3"
                value={form.reg3}
                onChange={(e) => handleRegInput(e, 5)}
                ref={reg3}
                maxLength={5}
                className="w-16 border rounded px-2 py-2 text-center"
                placeholder="00000"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">주소</label>
            <input
              name="addr"
              value={form.addr}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="주소를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">사업자 명</label>
            <input
              name="owner"
              value={form.owner}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="사업자 명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="이메일을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">연락처</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
              placeholder="010-0000-0000"
              inputMode="tel"
              pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
            />
          </div>

          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
