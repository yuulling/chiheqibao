"use client";

interface Product {
  id: string;
  name: string;
  price: number | null;
  unit: string;
  published: boolean;
  featured: boolean;
  category: { name: string } | null;
  createdAt: string;
}

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-500">产品名称</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500">分类</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">价格</th>
            <th className="text-center py-3 px-4 font-medium text-gray-500">状态</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500">操作</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{product.name}</div>
              </td>
              <td className="py-3 px-4 text-gray-500">
                {product.category?.name || "-"}
              </td>
              <td className="py-3 px-4 text-right">
                {product.price ? (
                  <span className="font-medium text-accent-500">
                    ¥{product.price.toLocaleString()} / {product.unit}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span
                    className={`inline-block w-2 h-2 rounded-full ${
                      product.published ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-xs text-gray-500">
                    {product.published ? "已发布" : "草稿"}
                  </span>
                  {product.featured && (
                    <span className="text-xs bg-accent-50 text-accent-500 px-1.5 py-0.5 rounded">
                      推荐
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <a
                    href={`/admin/products/${product.id}/edit`}
                    className="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    编辑
                  </a>
                  <button
                    onClick={() => {
                      if (confirm("确定要删除这个产品吗？")) onDelete(product.id);
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="py-12 text-center text-gray-400">
                暂无产品
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
