import {
  closestCenter,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';

export function createCollisonStrategy(
  columns: { key: string }[]
): CollisionDetection {
  return (args) => {
    // First, check if pointer is within any droppable column
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      // Filter to only get droppable columns (not draggable items)
      const droppableCollisions = pointerCollisions.filter((collision) => {
        const columnKeys = columns.map((col) => col.key);
        return columnKeys.includes(collision.id as string);
      });

      if (droppableCollisions.length > 0) {
        return droppableCollisions;
      }
    }

    // Fallback to rectangle intersection for columns
    const rectCollisions = rectIntersection(args);
    if (rectCollisions.length > 0) {
      const droppableCollisions = rectCollisions.filter((collision) => {
        const columnKeys = columns.map((col) => col.key);
        return columnKeys.includes(collision.id as string);
      });

      if (droppableCollisions.length > 0) {
        return droppableCollisions;
      }
    }

    // Last resort: use closest center
    return closestCenter(args);
  };
}
