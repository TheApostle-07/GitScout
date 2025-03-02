from fastapi import APIRouter
from app.services.github_fetcher import (
    fetch_repos_for_user,
    fetch_commits_for_repo,
    fetch_full_user_display_data,
    fetch_github_rate_limit  # <--- import the new function
)

router = APIRouter()

@router.get("/repos")
def get_repos(username: str):
    """Return all public repos for a user (raw data)."""
    repos_data, _ = fetch_repos_for_user(username)
    return repos_data

@router.get("/commits")
def get_commits(username: str, repo_name: str):
    """Return commits for a given repo (raw data)."""
    commits_data, _ = fetch_commits_for_repo(username, repo_name)
    return commits_data

@router.get("/user_full")
def get_user_full(username: str):
    """
    Combine everything:
    - user profile
    - rate-limit info -> analysis_remaining
    - total repos
    - top 3 repos by star count
    - commits for those top 3 repos
    """
    data = fetch_full_user_display_data(username)
    return data

@router.get("/rate_limit")
def get_github_rate_limit():
    """
    Return the current GitHub rate-limit usage for your token.
    """
    return fetch_github_rate_limit()