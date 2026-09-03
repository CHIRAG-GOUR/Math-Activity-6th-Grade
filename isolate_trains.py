from PIL import Image
from collections import deque

def isolate_train(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()

    # Visited grid
    visited = [[False] * height for _ in range(width)]
    queue = deque()

    def is_black_outline(r, g, b):
        return r < 45 and g < 45 and b < 45

    def is_sky_or_grass_or_cloud(r, g, b):
        # Sky: blue / cyan
        if b > 180 and b > r + 30:
            return True
        # Cloud: near white
        if r > 215 and g > 215 and b > 215:
            return True
        # Grass: green at bottom
        if g > 140 and g > b + 20 and g > r:
            return True
        # Light ground green/yellow
        if g > 160 and r > 120 and b < 100:
            return True
        return False

    # Seed all 4 border pixels
    for x in range(width):
        for y in [0, 1, 2, height - 3, height - 2, height - 1]:
            r, g, b, a = pixels[x, y]
            if not is_black_outline(r, g, b):
                queue.append((x, y))
                visited[x][y] = True

    for y in range(height):
        for x in [0, 1, 2, width - 3, width - 2, width - 1]:
            if not visited[x][y]:
                r, g, b, a = pixels[x, y]
                if not is_black_outline(r, g, b):
                    queue.append((x, y))
                    visited[x][y] = True

    # BFS flood fill from outside
    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (0, 0, 0, 0) # Make transparent

        for dx, dy in [(-1,0), (1,0), (0,-1), (0,1), (-1,-1), (1,-1), (-1,1), (1,1)]:
            nx, ny = x + dx, y + dy
            if 0 <= nx < width and 0 <= ny < height and not visited[nx][ny]:
                r, g, b, a = pixels[nx, ny]
                # If it's not a dark black outline and matches background or is not inside train
                if not is_black_outline(r, g, b):
                    visited[nx][ny] = True
                    queue.append((nx, ny))

    img.save(output_path, "PNG")
    print(f"Saved transparent train: {output_path}")

isolate_train("public/images/red_locomotive.png", "public/images/red_train_transparent.png")
isolate_train("public/images/blue_locomotive.png", "public/images/blue_train_transparent.png")
