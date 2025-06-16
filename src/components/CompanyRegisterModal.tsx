import { useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
}

export default function CompanyRegisterModal({ open, onClose, onSubmit }: Props) {
  const reg1 = useRef<HTMLInputElement>(null!);
  const reg2 = useRef<HTMLInputElement>(null!);
  const reg3 = useRef<HTMLInputElement>(null!);

  if (!open) return null;

  const handleRegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    len: number,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, len);
    e.target.value = value;
    if (value.length === len && nextRef?.current) nextRef.current.focus();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const reg = `${formData.get("reg1")}-${formData.get("reg2")}-${formData.get("reg3")}`;

    const data = {
      name: formData.get("name"),
      companyType: formData.get("companyType"),
      reg,
      addr: formData.get("addr"),
      owner: formData.get("owner"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };

    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-[420px] p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
        <div className="text-2xl font-bold mb-6">회사 등록</div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">회사명</label>
            <input name="name" required className="w-full border rounded px-3 py-2" placeholder="회사명을 입력하세요" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">회사 구분</label>
            <div className="flex gap-6 px-1 py-1">
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" name="companyType" value="CLIENT" required className="accent-[#FFC10A]" /> 고객사
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input type="radio" name="companyType" value="AGENCY" required className="accent-[#FFC10A]" /> 개발사
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">사업자등록번호</label>
            <div className="flex gap-2">
              <input
                name="reg1"
                required
                ref={reg1}
                maxLength={3}
                className="w-14 border rounded px-2 py-2 text-center"
                placeholder="000"
                inputMode="numeric"
                onChange={(e) => handleRegInput(e, 3, reg2)}
              />
              <span className="self-center">-</span>
              <input
                name="reg2"
                required
                ref={reg2}
                maxLength={2}
                className="w-10 border rounded px-2 py-2 text-center"
                placeholder="00"
                inputMode="numeric"
                onChange={(e) => handleRegInput(e, 2, reg3)}
              />
              <span className="self-center">-</span>
              <input
                name="reg3"
                required
                ref={reg3}
                maxLength={5}
                className="w-16 border rounded px-2 py-2 text-center"
                placeholder="00000"
                inputMode="numeric"
                onChange={(e) => handleRegInput(e, 5)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">주소</label>
            <input name="addr" required className="w-full border rounded px-3 py-2" placeholder="주소를 입력하세요" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">사업자 명</label>
            <input name="owner" required className="w-full border rounded px-3 py-2" placeholder="사업자 명을 입력하세요" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input name="email" type="email" required className="w-full border rounded px-3 py-2" placeholder="이메일을 입력하세요" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">연락처</label>
            <input name="phone" required className="w-full border rounded px-3 py-2" placeholder="010-0000-0000" />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">취소</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600">등록</button>
          </div>
        </form>
      </div>
    </div>
  );
}
