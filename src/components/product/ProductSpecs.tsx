interface Spec {
  label: string;
  value: string;
}

export function ProductSpecs({ specs }: { specs: string }) {
  let parsedSpecs: Spec[] = [];
  try {
    parsedSpecs = JSON.parse(specs);
  } catch {
    return null;
  }

  if (!Array.isArray(parsedSpecs) || parsedSpecs.length === 0) return null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">规格参数</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            {parsedSpecs.map((spec, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                <td className="px-4 py-3 text-gray-500 font-medium w-1/3">{spec.label}</td>
                <td className="px-4 py-3 text-gray-900">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
