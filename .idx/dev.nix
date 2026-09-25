# Project IDX configuration for RailVoya
{ pkgs, ... }: {
  channel = "stable-24.05";

  packages = [
    pkgs.nodejs_20
    pkgs.python312
    pkgs.python312Packages.pip
    pkgs.python312Packages.virtualenv
    pkgs.uv
  ];

  env = {
    PORT = "8000";
    ENVIRONMENT = "development";
  };

  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
      "ms-python.python"
      "bradlc.vscode-tailwindcss"
    ];

    workspace = {
      onCreate = {
        backend-setup = "cd backend && uv venv && uv pip install -e .";
        frontend-setup = "cd frontend && npm install";
      };
      onStart = {
        backend-start = "cd backend && uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload";
        frontend-start = "cd frontend && npm run dev -- --host 0.0.0.0 --port 5173";
      };
    };

    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--host" "0.0.0.0" "--port" "$PORT"];
          cwd = "frontend";
          manager = "web";
        };
      };
    };
  };
}
