import { useRef, useEffect, RefObject } from 'react';

interface CompanyData {
  name: string;
  companyType: string;
  reg: string;
  addr: string;
  owner: string;
  email: string;
  phone: string;
  [key: string]: any; // Add index signature for form data access if needed
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: CompanyData) => void; // Use CompanyData type
  initialData: CompanyData | null; // Use CompanyData or null type
}

export default function CompanyEditModal({ open, onClose, onSave, initialData }: Props) {
  const reg1 = useRef<HTMLInputElement | null>(null);
  const reg2 = useRef<HTMLInputElement | null>(null);
  const reg3 = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (open && formRef.current && initialData) {
      // 폼 값 세팅
      // Access form elements safely
      const form = formRef.current;
      form.name.value = initialData.name || '';
      form.companyType.value = initialData.companyType || '';
      const [r1, r2, r3] = (initialData.reg || '').split('-');
      if (form.reg1) form.reg1.value = r1 || '';
      if (form.reg2) form.reg2.value = r2 || '';
      if (form.reg3) form.reg3.value = r3 || '';
      form.addr.value = initialData.addr || '';
      form.owner.value = initialData.owner || '';
      form.email.value = initialData.email || '';
      form.phone.value = initialData.phone || '';
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleRegInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    len: number,
    nextRef?: RefObject<HTMLInputElement>
  ) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > len) value = value.slice(0, len);
    e.target.value = value;
    if (value.length === len && nextRef && nextRef.current) {
      nextRef.current.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg w-[420px] p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
        <div className="text-2xl font-bold mb-6">회사 정보 수정</div>
        <form
          ref={formRef}
          onSubmit={e => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data: CompanyData = {
              name: formData.get('name') as string,
              companyType: formData.get('companyType') as string,
              reg: `${formData.get('reg1')}-${formData.get('reg2')}-${formData.get('reg3')}`,
              addr: formData.get('addr') as string,
              owner: formData.get('owner') as string,
              email: formData.get('email') as string,
              phone: formData.get('phone') as string,
            };
            onSave(data);
          }}
          className="flex flex-col gap-4"
        >
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
              <input name="reg1" required ref={reg1} maxLength={3} className="w-14 border rounded px-2 py-2 text-center" placeholder="000"
                onInput={e => handleRegInput(e, 3, reg2)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span className="self-center">-</span>
              <input name="reg2" required ref={reg2} maxLength={2} className="w-10 border rounded px-2 py-2 text-center" placeholder="00"
                onInput={e => handleRegInput(e, 2, reg3)}
                inputMode="numeric"
                pattern="[0-9]*"
              />
              <span className="self-center">-</span>
              <input name="reg3" required ref={reg3} maxLength={5} className="w-16 border rounded px-2 py-2 text-center" placeholder="00000"
                onInput={e => handleRegInput(e, 5)}
                inputMode="numeric"
                pattern="[0-9]*"
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
            <button type="submit" className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
} 