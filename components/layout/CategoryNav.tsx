// CategoryNav — horizontal scrollable category navigation bar
// Sits below the Header. Links to /shop/[category] for each category.

const CATEGORIES = [
  "Meat",
  "Fish & Seafood",
  "Vegetables",
  "Grains & Flour",
  "Spices & Seasonings",
  "Canned & Packets",
  "Cooking Oil",
  "Drinks",
  "Frozen Foods",
  "Sauces & Paste",
  "Snacks",
  "Beauty & Household",
];

export default function CategoryNav() {
  return (
    <nav className="bg-white border-b border-border overflow-x-auto">
      {/* TODO: Map categories to scrollable pill links */}
      <div className="flex gap-1 px-4 py-2 min-w-max">
        {CATEGORIES.map((cat) => (
          <span key={cat} className="px-3 py-1.5 text-sm whitespace-nowrap rounded-full hover:bg-brand-50 hover:text-brand-600 cursor-pointer transition-colors">
            {cat}
          </span>
        ))}
      </div>
    </nav>
  );
}
