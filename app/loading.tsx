export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/30 backdrop-blur-[2px] transition-opacity duration-300">
      <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#95bb72] border-t-transparent"></div>
    </div>
  );
}
