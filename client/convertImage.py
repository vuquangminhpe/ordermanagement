import numpy as np
import cv2
import open3d as o3d
import torch
from transformers import DPTFeatureExtractor, DPTForDepthEstimation
from PIL import Image
import matplotlib.pyplot as plt

class Image3DConverter:
    def __init__(self):
        self.feature_extractor = DPTFeatureExtractor.from_pretrained("Intel/dpt-large")
        self.depth_estimator = DPTForDepthEstimation.from_pretrained("Intel/dpt-large")
        
        if torch.cuda.is_available():
            self.depth_estimator.to('cuda')
        
    def estimate_depth(self, image_path):
      
        image = Image.open(image_path)
        inputs = self.feature_extractor(images=image, return_tensors="pt")
        
        if torch.cuda.is_available():
            inputs = {k: v.to('cuda') for k, v in inputs.items()}
        
        with torch.no_grad():
            outputs = self.depth_estimator(**inputs)
            predicted_depth = outputs.predicted_depth
        
        depth_map = predicted_depth.squeeze().cpu().numpy()
        
        depth_map = (depth_map - depth_map.min()) / (depth_map.max() - depth_map.min())
        return depth_map * 255
    
    def create_point_cloud(self, image_path, depth_map):
       
        image = cv2.imread(image_path)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        height, width = depth_map.shape
        fx = width * 1.2  
        fy = height * 1.2 
        cx = width / 2   
        cy = height / 2  
        
        points = []
        colors = []
        
        for v in range(height):
            for u in range(width):
                z = depth_map[v, u] / 255.0  
                if z > 0:
                    x = (u - cx) * z / fx
                    y = (v - cy) * z / fy
                    points.append([x, y, z])
                    colors.append(image[v, u] / 255.0)
        
        pcd = o3d.geometry.PointCloud()
        pcd.points = o3d.utility.Vector3dVector(np.array(points))
        pcd.colors = o3d.utility.Vector3dVector(np.array(colors))
        
        return pcd
    
    def process_point_cloud(self, pcd):
      
        pcd, _ = pcd.remove_statistical_outlier(nb_neighbors=20, std_ratio=2.0)
        
        pcd = pcd.voxel_down_sample(voxel_size=0.02)
        
        pcd.estimate_normals(
            search_param=o3d.geometry.KDTreeSearchParamHybrid(radius=0.1, max_nn=30)
        )
        pcd.orient_normals_consistent_tangent_plane(k=15)
        
        return pcd
    
    def create_mesh(self, pcd):
       
        mesh, densities = o3d.geometry.TriangleMesh.create_from_point_cloud_poisson(
            pcd, depth=9, width=0, scale=1.1, linear_fit=False
        )
                vertices_to_remove = densities < np.quantile(densities, 0.1)
        mesh.remove_vertices_by_mask(vertices_to_remove)
                mesh.filter_smooth_taubin(number_of_iterations=100)
        
        return mesh
    
    def process_image(self, image_path, output_path=None):
               print("Estimating depth map...")
        depth_map = self.estimate_depth(image_path)
                print("Creating point cloud...")
        pcd = self.create_point_cloud(image_path, depth_map)
                print("Processing point cloud...")
        pcd = self.process_point_cloud(pcd)
                print("Creating mesh...")
        mesh = self.create_mesh(pcd)
                if output_path:
            o3d.io.write_triangle_mesh(output_path, mesh)
        
        return mesh, pcd

def main():
    converter = Image3DConverter()
        image_path = "input_image.jpg" 
    output_path = "output_model.ply"  
    
    mesh, pcd = converter.process_image(image_path, output_path)
    
    o3d.visualization.draw_geometries([mesh])

if __name__ == "__main__":
    main()