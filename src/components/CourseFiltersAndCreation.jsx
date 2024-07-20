import React from 'react';
import { Search, Plus } from 'lucide-react';

const CourseFiltersAndCreation = ({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  newCategory,
  newTag,
  onCategoryChange,
  onTagToggle,
  onNewCategoryChange,
  onNewTagChange,
  onAddCategory,
  onAddTag
}) => {
  return (
    <div className="bg-orange-50 p-6 rounded-lg shadow-sm mb-6">
      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="px-2 w-full md:w-1/2 lg:w-1/3 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category-select">
            Catégorie
          </label>
          <div className="relative">
            <select
              id="category-select"
              value={selectedCategory}
              onChange={onCategoryChange}
              className="block appearance-none w-full bg-white border border-orange-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-orange-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-orange-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="px-2 w-full md:w-1/2 lg:w-2/3 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap -mx-1">
            {tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className={`m-1 px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTags.includes(tag.id)
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap -mx-2">
        <div className="px-2 w-full md:w-1/2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="new-category">
            Nouvelle catégorie
          </label>
          <div className="flex">
            <input
              type="text"
              id="new-category"
              value={newCategory}
              onChange={onNewCategoryChange}
              className="flex-grow mr-2 shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-orange-300 rounded-md"
              placeholder="Nom de la catégorie"
            />
            <button
              onClick={onAddCategory}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="px-2 w-full md:w-1/2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="new-tag">
            Nouveau tag
          </label>
          <div className="flex">
            <input
              type="text"
              id="new-tag"
              value={newTag}
              onChange={onNewTagChange}
              className="flex-grow mr-2 shadow-sm focus:ring-orange-500 focus:border-orange-500 block w-full sm:text-sm border-orange-300 rounded-md"
              placeholder="Nom du tag"
            />
            <button
              onClick={onAddTag}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseFiltersAndCreation;