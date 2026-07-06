export function EmptyState({ message = "暂无数据" }: { message?: string }) {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">📭</div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
