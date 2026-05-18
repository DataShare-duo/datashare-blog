import { visit } from "unist-util-visit";

/**
 * 将 h1 标题的文字内容包裹在 <span class="heading-text"> 中，
 * 保留 <a class="anchor"> 锚点在外层，使 CSS 可以精准给文字加背景标签。
 */
export function rehypeWrapH1Text() {
  return (tree) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "h1") return;

      // 找到 anchor 子元素
      const anchorIdx = node.children.findIndex((child) => {
        if (child.type !== "element" || child.tagName !== "a") return false;
        const cls = child.properties?.className || child.properties?.class || "";
        return Array.isArray(cls)
          ? cls.includes("anchor")
          : String(cls).includes("anchor");
      });

      if (anchorIdx === -1) {
        // 无 anchor：全部文字包裹
        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["heading-text"] },
            children: node.children,
          },
        ];
      } else if (anchorIdx > 0) {
        // 文字在前，anchor 在后
        node.children = [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["heading-text"] },
            children: node.children.slice(0, anchorIdx),
          },
          node.children[anchorIdx],
        ];
      }
      // anchorIdx === 0 不处理
    });
  };
}
