#!/bin/bash

# The Amplitude Institute - Website Deployment Script
# This script helps with building and deploying the containerized website

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE} The Amplitude Institute - Deploy Tool${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    
    print_success "Docker is installed and running"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_success "Docker Compose is available"
}

# Build the Docker image
build_image() {
    print_info "Building Docker image..."
    
    if docker build -t amplitude-institute .; then
        print_success "Docker image built successfully"
    else
        print_error "Failed to build Docker image"
        exit 1
    fi
}

# Start the container using Docker Compose
start_container() {
    print_info "Starting container with Docker Compose..."
    
    if docker-compose up -d; then
        print_success "Container started successfully"
        print_info "Website is available at: http://localhost"
    else
        print_error "Failed to start container"
        exit 1
    fi
}

# Stop the container
stop_container() {
    print_info "Stopping container..."
    
    if docker-compose down; then
        print_success "Container stopped successfully"
    else
        print_error "Failed to stop container"
        exit 1
    fi
}

# View logs
show_logs() {
    print_info "Showing container logs (Press Ctrl+C to exit)..."
    docker-compose logs -f
}

# Health check
health_check() {
    print_info "Performing health check..."
    
    # Wait a moment for container to be ready
    sleep 5
    
    if curl -f http://localhost/health &> /dev/null; then
        print_success "Website is healthy and responding"
        print_info "Website URL: http://localhost"
    else
        print_warning "Health check failed. Container might still be starting..."
        print_info "You can check the logs with: ./deploy.sh logs"
    fi
}

# Clean up Docker resources
cleanup() {
    print_info "Cleaning up Docker resources..."
    
    # Stop and remove containers
    docker-compose down
    
    # Remove images (optional, uncomment if needed)
    # docker rmi amplitude-institute 2>/dev/null || true
    
    # Remove unused Docker resources
    docker system prune -f
    
    print_success "Cleanup completed"
}

# Show usage information
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  start       Build and start the website container"
    echo "  stop        Stop the website container"
    echo "  restart     Restart the website container"
    echo "  logs        Show container logs"
    echo "  health      Check if the website is responding"
    echo "  cleanup     Stop containers and clean up Docker resources"
    echo "  help        Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start     # Build and start the website"
    echo "  $0 logs      # View real-time logs"
    echo "  $0 health    # Check if website is running"
    echo
}

# Main script logic
main() {
    print_header
    
    case "${1:-start}" in
        "start")
            check_docker
            check_docker_compose
            build_image
            start_container
            health_check
            ;;
        "stop")
            check_docker
            check_docker_compose
            stop_container
            ;;
        "restart")
            check_docker
            check_docker_compose
            stop_container
            build_image
            start_container
            health_check
            ;;
        "logs")
            check_docker
            check_docker_compose
            show_logs
            ;;
        "health")
            health_check
            ;;
        "cleanup")
            check_docker
            check_docker_compose
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown command: $1"
            echo
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"