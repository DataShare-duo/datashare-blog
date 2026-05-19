import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils.ts";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].slug;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].slug;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export type PostForList = {
	slug: string;
	data: CollectionEntry<"posts">["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type CategoryNode = {
	name: string;
	count: number;
	totalCount: number;
	url: string;
	children: CategoryNode[];
};

export async function getCategoryList(): Promise<CategoryNode[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: { [key: string]: number } = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return count[b] - count[a];
	});

	const ret: CategoryNode[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			totalCount: count[c],
			url: getCategoryUrl(c),
			children: [],
		});
	}
	return ret;
}

export function buildCategoryTree(flat: CategoryNode[]): CategoryNode[] {
	interface TreeNode {
		name: string;
		fullPath: string;
		count: number;
		totalCount: number;
		children: Map<string, TreeNode>;
	}

	const root: Map<string, TreeNode> = new Map();

	for (const cat of flat) {
		const parts = cat.name.split("/");
		let currentMap = root;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isLeaf = i === parts.length - 1;

			if (!currentMap.has(part)) {
				currentMap.set(part, {
					name: part,
					fullPath: parts.slice(0, i + 1).join("/"),
					count: 0,
					totalCount: 0,
					children: new Map(),
				});
			}

			const node = currentMap.get(part)!;
			node.totalCount += cat.totalCount;
			if (isLeaf) {
				node.count = cat.count;
			}

			currentMap = node.children;
		}
	}

	function toArray(map: Map<string, TreeNode>): CategoryNode[] {
		const arr: CategoryNode[] = [];
		for (const node of map.values()) {
			const children = toArray(node.children);
			children.sort((a, b) => b.totalCount - a.totalCount);
			arr.push({
				name: node.name,
				count: node.count,
				totalCount: node.totalCount,
				url: getCategoryUrl(node.fullPath),
				children,
			});
		}
		arr.sort((a, b) => b.totalCount - a.totalCount);
		return arr;
	}

	return toArray(root);
}