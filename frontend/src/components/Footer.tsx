export default function Footer(): JSX.Element {
  return (
    <nav className="hidden flex items-center justify-center py-3 px-5 rounded-full mb-4 w-full max-w-[1200px] mx-auto ">
      <p className="text-white/80 mx-auto text-center">
        Copyright © GinKhaoReaYang {new Date().getFullYear()}. All rights
        reserved.
      </p>
    </nav>
  );
}
