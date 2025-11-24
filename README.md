# Memo

- [First practice on React + Firebase](https://wangtzu.netlify.app/)

## Useful

> #!/usr/bin/bash
> sources=(
> 'https://github.com/jlanzarotta/bufexplorer.git'
> 'https://github.com/preservim/nerdtree.git'
> 'https://github.com/preservim/vim-markdown.git'
> 'https://github.com/itchyny/lightline.vim.git'
> )
> 
> for i in "${sources[@]}"; do
>     plugin=`basename ${i} .git`
>     echo ${plugin}
>     git clone ${i} ~/.vim/pack/vendor/start/${plugin}
>     vim -u NONE -c "helptags ~/.vim/pack/vendor/start/${plugin}/doc" -c q
> done
>
>
>
> " F2 for highlight word under cursor
> nnoremap <F2> :let @/='\<<C-R>=expand("<cword>")<CR>\>'<CR>:set hls<CR>
